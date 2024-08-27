import "./navbar.css";
import { IoMdPerson } from "react-icons/io";
import { MdOutlineChat } from "react-icons/md";
import { MdOutlineNotificationsNone } from "react-icons/md";
import { IoSearch } from "react-icons/io5";
import useAuth from "../../hooks/useAuth";
import { useGetUsersQuery } from "../../features/profile/usersApiSlice";
import { Link, useLocation, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import FriendAccept from "../friendAccpt/FriendAccept";
import { MdOutlineDataset } from "react-icons/md";
import { GoHome } from "react-icons/go";
import Share from "../../conponents/share/Share";

import {
	selectshowReqest,
	toggleComponent,
	toggleRequest,
} from "../../features/auth/authSlice";
import { useState } from "react";
// const IMG_URL = import.meta.env.VITE_PUBLIC_FOLDER;

const Navbar = () => {
	const { userId } = useAuth();
	const dispatch = useDispatch();
	const showReqest = useSelector(selectshowReqest);
	const { "*": personParam } = useParams(); // Destructure '*'

	const location = useLocation();
	const isMessengerPage = location.pathname.includes("messenger");

	const [shareDrop, setShareDrop] = useState(false);
	const [smallMediaQeryShare, setSmallMediaQeryShare] = useState(false);

	// Check if 'personParam' exists and is a string
	if (typeof personParam !== "string") {
		console.error("Invalid person param:", personParam);
		return null; // Handle invalid case gracefully, maybe return a placeholder or nothing
	}

	// Split the 'personParam' string by "/" and get the last item
	const parts = personParam.split("/");
	const lastItem = parts.length > 1 ? parts.pop() : parts[0]; // Fallback to the first part if length is 1

	const { user } = useGetUsersQuery("usersList", {
		selectFromResult: ({ data }) => ({
			user: data?.entities[userId],
		}),
	});

	// const handleToggle = () => {
	// 	dispatch(toggleComponent());
	// };

	const handleRequst = () => {
		dispatch(toggleRequest());
	};

	const toggleShare = () => {
		setShareDrop(!shareDrop);
	};
	const toggleSmallMediaQueryShare = () => {
		setSmallMediaQeryShare(!smallMediaQeryShare);
	};

	const truncateUsername = (username) => {
		if (username && username.length > 10) {
			return `${username.substring(0, 10)}...`;
		}
		return username;
	};

	return (
		<nav className="nav">
			<div className="nav_top">
				<div className="nav_logo">
					<Link to="/home">
						<h3 className="nav_logo_text">Conn-World</h3>
					</Link>
					{/* <button className="nav_addFriend" onClick={handleToggle}>
						Add Friends
					</button> */}
				</div>
				<div className="nav_input">
					<IoSearch className="nav_input_icon" />
					<input
						className="nav_input_search"
						type="text"
						placeholder={`${user?.username.toUpperCase()}  Search for and posts`}
					/>
					<div className="nav_share_dropdown">
						{shareDrop && (
							<div className="nav_share_toggling">
								<Share />
							</div>
						)}
						<button className="nav_share_button" onClick={toggleShare}>
							{truncateUsername(user?.username)} Share with friends
						</button>
					</div>
				</div>
				<ul className="nav_list">
					{/* <div className="nav_list_text"></div> */}
					<div className="nav_icons">
						{lastItem === "persons" ? (
							<span className="nav_list_item">
								<Link to="/home">
									<GoHome title="Go to home page" className="nav_icon" />
								</Link>
							</span>
						) : (
							<span className="nav_list_item">
								<Link to="/home/persons">
									<MdOutlineDataset title="Settings" className="nav_icon" />
								</Link>
							</span>
						)}
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
						<Link to="/home/messenger">
							<div className="nav_list_icon">
								<MdOutlineChat
									title="chat notifications"
									className="nav_icon"
								/>
								<span className="nav_span">56</span>
							</div>
						</Link>
						<div className="nav_list_icon">
							<MdOutlineNotificationsNone
								title="notifications"
								className="nav_icon"
							/>
							<span className="nav_span">23</span>
						</div>
						<Link to={`/home/${user?._id}`}>
							<img
								title="profile pictures"
								src={
									user?.profilePicture
										? user?.profilePicture
										: "/images/avatar2.png"
								}
								alt="profile"
								className="nav_img"
							/>
						</Link>
					</div>
					{/* <div className="nav_profile_picture"></div> */}
				</ul>
			</div>
			{!isMessengerPage && (
				<div className="feed_share_dropdown">
					{smallMediaQeryShare && (
						<div className="feed_share_toggling">
							<Share />
						</div>
					)}
					<button
						className="feed_share_button "
						onClick={toggleSmallMediaQueryShare}
					>
						{`${user?.username} Share Photos/Vidoes`}
					</button>
				</div>
			)}
		</nav>
	);
};

export default Navbar;
