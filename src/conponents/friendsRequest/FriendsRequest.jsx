import React from "react";
import "./FriendsRequest.css";
import { Link, useParams } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { useGetUsersQuery } from "../../features/profile/usersApiSlice";
import useFriendRequest from "../../hooks/useFriedRequest";
const IMG_URL = import.meta.env.VITE_PUBLIC_FOLDER;

const FriendsRequest = ({ friendId }) => {
	const { userId: paramsId } = useParams();
	const { userId } = useAuth();

	const { currentUser } = useGetUsersQuery("usersList", {
		selectFromResult: ({ data }) => ({
			currentUser: data?.entities[userId],
		}),
	});

	const { friendUsers, isLoading, isError } = useGetUsersQuery("usersList", {
		selectFromResult: ({ data }) => ({
			friendUsers: data?.entities[friendId],
		}),
	});

	if (isLoading) {
		return <RingLoader size={20} margin="auto" color="#000" />; // Show loading indicator
	}

	if (isError || !friendUsers) {
		return <p>Error loading friend details</p>; // Show error message or handle accordingly
	}

	const { sendFriendshipButtons, acceptFriendshipButtons } = useFriendRequest(
		userId,
		friendId // Use friendId directly from props
	);

	return (
		<ul className="friend_request_container">
			{currentUser?.friendReceiver?.includes(friendUsers?._id) ||
			userId === friendUsers?._id ? null : (
				<li className="friend_request_lists">
					<Link
						to={`/home/${friendUsers?._id}`}
						className="friend_request_image"
					>
						<img
							className="friend_request_img"
							src={
								friendUsers?.profilePicture
									? IMG_URL + friendUsers?.profilePicture
									: IMG_URL + "/avatar2.png"
							}
							alt=""
						/>
					</Link>
					<div className="friend_request_names">
						<p className="friend_request_name">{friendUsers?.firstname}</p>
						<p className="friend_request_name">{friendUsers?.lastname}</p>
					</div>
					<div className="friend_request_btn">{sendFriendshipButtons()}</div>
				</li>
			)}
		</ul>
	);
};

export default FriendsRequest;
