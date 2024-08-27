import React from "react";
import { useGetUsersQuery } from "../../features/profile/usersApiSlice";
import { Link } from "react-router-dom";
import useFriendRequest from "../../hooks/useFriedRequest";
const IMG_URL = import.meta.env.VITE_PUBLIC_FOLDER;
import useAuth from "../../hooks/useAuth";

const LikeDropdown = ({ likerId, scrollToPictures }) => {
	const { userId } = useAuth();
	const { user } = useGetUsersQuery("postsList", {
		selectFromResult: ({ data }) => ({
			user: data?.entities[likerId],
		}),
	});

	const friendId = likerId;

	const { sendFriendshipButtons } = useFriendRequest(userId, friendId);
	return (
		<>
			<li key={likerId} className="likeDropdown_list">
				<Link
					className="likeDropdwon_name_img"
					to={`/home/${user?._id}`}
					onClick={scrollToPictures}
				>
					<img
						className="likeDropdown_img"
						src={
							user?.profilePicture
								? user?.profilePicture
								: "/images/avatar2.png"
						} // Replace with actual avatar URL
						alt=""
					/>
					{/* Display name or username */}
					<span className="likeDropdown_name">
						{user?.firstname} {user?.lastname}
					</span>
				</Link>
				<div className="likeDropdown_friend_request_btn">
					{userId !== likerId && sendFriendshipButtons()}
				</div>
			</li>
			<hr className="likeDropdown_hr"></hr>
		</>
	);
};

export default LikeDropdown;
