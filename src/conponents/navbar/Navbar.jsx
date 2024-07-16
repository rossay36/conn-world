import "./navbar.css";
import { IoMdPerson } from "react-icons/io";
import { MdOutlineChat } from "react-icons/md";
import { MdOutlineNotificationsNone } from "react-icons/md";
import { IoSearch } from "react-icons/io5";
import useAuth from "../../hooks/useAuth";
import { useGetUsersQuery } from "../../features/profile/usersApiSlice";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import FriendAccept from "../friendAccpt/FriendAccept";
import {
	selectshowReqest,
	toggleComponent,
	toggleRequest,
} from "../../features/auth/authSlice";
const IMG_URL = import.meta.env.VITE_PUBLIC_FOLDER;

const Navbar = () => {
	const { userId } = useAuth();
	const dispatch = useDispatch();
	const showReqest = useSelector(selectshowReqest);

	const { user } = useGetUsersQuery("usersList", {
		selectFromResult: ({ data }) => ({
			user: data?.entities[userId],
		}),
	});

	const handleToggle = () => {
		dispatch(toggleComponent());
	};

	const handleRequst = () => {
		dispatch(toggleRequest());
	};

	return (
		<nav className="nav">
			<div className="nav_logo">
				<h3>Conn-Wolrd</h3>
				<button className="nav_addFriend" onClick={handleToggle}>
					Add Friends
				</button>
			</div>

			<div className="nav_input">
				<IoSearch className="nav_input_icon" />
				<input
					className="nav_input_search"
					type="text"
					placeholder={`${user?.username.toUpperCase()} you can search for friends and posts`}
				/>
			</div>

			<ul className="nav_list">
				<div className="nav_list_text">
					<span className="nav_list_item">Homepage</span>
					<span className="nav_list_item">Timeline</span>
				</div>
				<div className="nav_icons">
					<div className="nav_list_icon">
						<IoMdPerson
							title="friend requests"
							className="nav_icon"
							onClick={handleRequst}
						/>
						{user?.friendReceiver?.length >= 0 && (
							<span className="nav_span">{user?.friendReceiver?.length}</span>
						)}
						{showReqest && <FriendAccept />}
					</div>

					<div className="nav_list_icon">
						<MdOutlineChat title="chat notifications" className="nav_icon" />
						<span className="nav_span">56</span>
					</div>

					<div className="nav_list_icon">
						<MdOutlineNotificationsNone
							title="notifications"
							className="nav_icon"
						/>
						<span className="nav_span">23</span>
					</div>
				</div>
				<div className="nav_profile_picture">
					<Link to={`/home/${user?._id}`}>
						<img
							title="profile pictures"
							src={
								user?.profilePicture
									? IMG_URL + user?.profilePicture
									: IMG_URL + "avatar2.png"
							}
							alt="profile"
							className="nav_img"
						/>
					</Link>
				</div>
			</ul>
		</nav>
	);
};

export default Navbar;
