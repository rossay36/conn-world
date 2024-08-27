import React from "react";
import { useGetUsersQuery } from "../../features/profile/usersApiSlice";
import { Link } from "react-router-dom";
import useFriendRequest from "../../hooks/useFriedRequest";
import useAuth from "../../hooks/useAuth";

// const IMG_URL = import.meta.env.VITE_PUBLIC_FOLDER;

const AllCurrentUserFriends = ({ friendId }) => {
	const { userId } = useAuth();

	const { friends } = useGetUsersQuery("usersList", {
		selectFromResult: ({ data }) => ({
			friends: data?.entities[friendId],
		}),
	});

	const { sendFriendshipButtons } = useFriendRequest(userId, friendId);

	return (
		<div className="leftbar_friends" key={friends?._id}>
			<Link className="leftbar_friends_user" to={`/home/${friends?._id}`}>
				<img
					className="leftbar_img"
					src={
						friends?.profilePicture
							? friends?.profilePicture
							: "/images/avatar2.png"
					}
					alt=""
				/>
				<div className="leftbar_names">
					<p className="leftbar_name">{friends?.firstname}</p>
					<p className="leftbar_name">{friends?.lastname}</p>
				</div>
			</Link>
			<div className="leftbar_unfollow_btn">{sendFriendshipButtons()}</div>
		</div>
	);
};

export default AllCurrentUserFriends;
