import React from "react";
import { useGetUsersQuery } from "./usersApiSlice";
import { Link } from "react-router-dom";
const IMG_URL = import.meta.env.VITE_PUBLIC_FOLDER;
import useAuth from "../../hooks/useAuth";
import useFriendRequest from "../../hooks/useFriedRequest";

export const CurrentUserFriends = ({ fIds, scrollToPictures }) => {
	const { userId } = useAuth();

	const { user, isLoading, isError, error } = useGetUsersQuery("usersList", {
		selectFromResult: ({ data }) => ({
			user: data?.entities[fIds],
		}),
	});

	const truncateUsername = (lastname) => {
		if (lastname && lastname.length > 10) {
			return `${lastname.substring(0, 10)}...`;
		}
		return lastname;
	};

	const friendId = fIds;

	const { sendFriendshipButtons } = useFriendRequest(userId, friendId);

	return (
		<li className="CurrentUserFriends_wrapper">
			<Link to={`/home/${user?._id}`} onClick={scrollToPictures}>
				<img
					className="CurrentUserFriends_img"
					src={
						user?.profilePicture
							? user?.profilePicture
							: IMG_URL + "/avatar2.png"
					}
					alt=""
				/>
			</Link>
			<div className="CurrentUserFriends_name_container">
				<p className="CurrentUserFriends_name">
					{user?.firstname} {truncateUsername(user?.lastname)}
				</p>
				<div className="CurrentUserFriends_name_btn">
					{sendFriendshipButtons()}
				</div>
			</div>
		</li>
	);
};
