import "./leftbar.css";
import { MdRssFeed, MdChat, MdEvent, MdGroup } from "react-icons/md";
import { FaPlay, FaUserFriends } from "react-icons/fa";
import { FaBookmark, FaCircleQuestion } from "react-icons/fa6";
import { IoBagOutline } from "react-icons/io5";
import { FaGraduationCap } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import {
	selectShowComponentA,
	toggleFrindAndFeedComponent,
} from "../../features/auth/authSlice";
import useAuth from "../../hooks/useAuth";
import Users from "../../features/homes/users/Users";
import { useGetUsersQuery } from "../../features/profile/usersApiSlice";
import AllCurrentUserFriends from "./AllCurrentUserFriends";
import { Link } from "react-router-dom";

const Leftbar = () => {
	const { userId } = useAuth();
	const showComponentA = useSelector(selectShowComponentA);
	const dispatch = useDispatch();

	const { currentUser } = useGetUsersQuery("usersList", {
		selectFromResult: ({ data }) => ({
			currentUser: data?.entities[userId],
		}),
	});

	const handleToggleFrindAndFeedComponent = () => {
		dispatch(toggleFrindAndFeedComponent());
	};

	return (
		<div className="leftbar">
			<div className="leftbar_wrap">
				<Link to="/home">
					<div className="leftbar__icons">
						<MdRssFeed className="leftbar_icon" />
						<p className="leftbar_list">Feed</p>
					</div>
				</Link>

				<Link to="/home/messanger">
					<div className="leftbar__icons">
						<MdChat className="leftbar_icon" />
						<p className="leftbar_list">Chat</p>
					</div>
				</Link>
				<div className="leftbar__icons">
					<FaPlay className="leftbar_icon" />
					<p className="leftbar_list">Video</p>
				</div>
				<div className="leftbar__icons">
					<MdGroup className="leftbar_icon" />
					<p className="leftbar_list">Group</p>
				</div>
				<div className="leftbar__icons">
					<FaBookmark className="leftbar_icon" />
					<p className="leftbar_list">Bookmark</p>
				</div>
				<div className="leftbar__icons">
					<FaCircleQuestion className="leftbar_icon" />
					<p className="leftbar_list">Question</p>
				</div>
				<div className="leftbar__icons">
					<IoBagOutline className="leftbar_icon" />
					<p className="leftbar_list">Job</p>
				</div>
				<div className="leftbar__icons">
					<MdEvent className="leftbar_icon" />
					<p className="leftbar_list">Events</p>
				</div>
				<Link to="/home/friend-request">
					<div className="leftbar__icons">
						<FaUserFriends className="leftbar_icon" />
						<p className="leftbar_list">Add Friends</p>
					</div>
				</Link>
			</div>

			<hr className="leftbar_hr" />
			{currentUser?.friends?.map((friendId) => (
				<AllCurrentUserFriends key={friendId} friendId={friendId} />
			))}
		</div>
	);
};

export default Leftbar;
