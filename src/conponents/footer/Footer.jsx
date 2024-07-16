import "./footer.css";
import { MdHome, MdOutlineEventRepeat } from "react-icons/md";
import { BsBlockquoteRight, BsBagDash } from "react-icons/bs";
import { MdLogout } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import {
	useSendLogoutMutation,
	useRefreshMutation,
} from "../../features/auth/authApiSlice";
import { useEffect } from "react";
import { useGetUsersQuery } from "../../features/profile/usersApiSlice";
import useAuth from "../../hooks/useAuth";

const IMG_URL = import.meta.env.VITE_PUBLIC_FOLDER;
const Footer = () => {
	const navigate = useNavigate();
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

	return (
		<div className="footers footer">
			<div className="footer_top">
				<p className="footer_text">Conn-World</p>
				<h3 className="footer_name">{user?.username}</h3>
				<Link to={`/home/${user?._id}`}>
					<img
						className="footer_img"
						src={
							user?.profilePicture
								? IMG_URL + user?.profilePicture
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
				<BsBagDash className="footer_icon" />
			</div>
			<div className="footer_logout">
				<p>Logout</p>
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
