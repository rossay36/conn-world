import "./leftbar.css";
import { MdRssFeed, MdChat, MdEvent, MdGroup } from "react-icons/md";
import { FaPlay } from "react-icons/fa";
import { FaBookmark, FaCircleQuestion } from "react-icons/fa6";
import { IoBagOutline } from "react-icons/io5";
import { FaGraduationCap } from "react-icons/fa";
import { useSelector } from "react-redux";
import { selectShowComponentA } from "../../features/auth/authSlice";
import useAuth from "../../hooks/useAuth";
import Users from "../../features/homes/users/Users";
import { useGetUsersQuery } from "../../features/profile/usersApiSlice";
import AllCurrentUserFriends from "./AllCurrentUserFriends";

const Leftbar = () => {
	const { userId } = useAuth();
	const showComponentA = useSelector(selectShowComponentA);

	const { currentUser } = useGetUsersQuery("usersList", {
		selectFromResult: ({ data }) => ({
			currentUser: data?.entities[userId],
		}),
	});

	return (
		<div className="leftbar">
			{showComponentA ? (
				<Users />
			) : (
				<div className="leftbar_wrap">
					<div className="leftbar__icons">
						<MdRssFeed className="leftbar_icon" />
						<p className="leftbar_list">Feed</p>
					</div>

					<div className="leftbar__icons">
						<MdChat className="leftbar_icon" />
						<p className="leftbar_list">Chat</p>
					</div>
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
					<div className="leftbar__icons">
						<FaGraduationCap className="leftbar_icon" />
						<p className="leftbar_list">Course</p>
					</div>
				</div>
			)}

			<hr className="leftbar_hr" />
			{currentUser?.friends?.map((user) => (
				<AllCurrentUserFriends key={user} user={user} />
			))}
		</div>
	);
};

export default Leftbar;
