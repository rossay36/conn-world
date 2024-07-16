import React from "react";
import { useGetUsersQuery } from "../../features/profile/usersApiSlice";
import { Link } from "react-router-dom";
const IMG_URL = import.meta.env.VITE_PUBLIC_FOLDER;

const ProfileUsersFriends = ({ user, scrollToPictures }) => {
	const {
		UserFrieds,
		isLoading: currentUserLoading,
		isError: currentUserError,
		refetch: refetchCurrentUser,
	} = useGetUsersQuery("usersList", {
		selectFromResult: ({ data }) => ({
			UserFrieds: data?.entities[user],
		}),
	});
	return (
		<>
			<div className="rightbarFollowings">
				<div className="rightbarFollowing">
					<Link to={`/home/${UserFrieds?._id}`} onClick={scrollToPictures}>
						<img
							className="rightbarFollowingImg"
							src={
								UserFrieds?.profilePicture
									? IMG_URL + UserFrieds?.profilePicture
									: IMG_URL + "/avatar2.png"
							}
							alt=""
						/>
					</Link>
					<span className="rightbarFollowingName">{UserFrieds?.username}</span>
				</div>
			</div>
		</>
	);
};

export default ProfileUsersFriends;
