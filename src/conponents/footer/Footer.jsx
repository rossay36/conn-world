import "./footer.css";
import { MdHome, MdOutlineEventRepeat } from "react-icons/md";
import { BsBlockquoteRight } from "react-icons/bs";
import { MdLogout } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import {
	useSendLogoutMutation,
	useRefreshMutation,
} from "../../features/auth/authApiSlice";
import { useEffect } from "react";
import { useGetUsersQuery } from "../../features/profile/usersApiSlice";
import useAuth from "../../hooks/useAuth";
import { FaUserFriends } from "react-icons/fa";
import { toggleFrindAndFeedComponent } from "../../features/auth/authSlice";
import { useDispatch } from "react-redux";

const IMG_URL = import.meta.env.VITE_PUBLIC_FOLDER;
const Footer = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const [sendLogout, { isLoading, isSuccess, isError, error }] =
		useSendLogoutMutation();

	const [refetch] = useRefreshMutation();

	const { userId } = useAuth();

	const { user } = useGetUsersQuery("usersList", {
		selectFromResult: ({ data }) => ({
			user: data?.entities[userId],
		}),
	});

	useEffect(() => {
		if (isSuccess) navigate("/");
	}, [isSuccess, navigate]);

	const onNewNoteClicked = () => {
		refetch();
		navigate(".");
	};

	const handleToggleFrindAndFeedComponent = () => {
		dispatch(toggleFrindAndFeedComponent());
	};

	return (
		<div className="footer">
			<div className="footer_top">
				<p className="footer_text">Conn-World</p>
				<h3 className="footer_name">{user?.username}</h3>
				<Link to={`/home/${user?._id}`}>
					<img
						className="footer_img"
						src={
							user?.profilePicture
								? user?.profilePicture
								: IMG_URL + "avatar2.png"
						}
						alt="profile"
					/>
				</Link>
			</div>
			<div className="footer_icons">
				<MdHome
					title="home"
					className="footer_icon"
					onClick={onNewNoteClicked}
				/>

				<BsBlockquoteRight className="footer_icon" />
				<MdOutlineEventRepeat className="footer_icon" />
				<Link to="/home/friend-request">
					<FaUserFriends className="footer_icon" />
				</Link>
			</div>
			<div className="footer_logout">
				<p className="footer_logout_text">Logout</p>
				<MdLogout
					className="footer_icon"
					title="Logout"
					type="button"
					onClick={sendLogout}
				/>
			</div>
		</div>
	);
};

export default Footer;
