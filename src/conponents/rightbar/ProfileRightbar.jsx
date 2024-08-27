import "./rightbar.css";
import useFriendRequest from "../../hooks/useFriedRequest";
import { useGetUsersQuery } from "../../features/profile/usersApiSlice";
import ProfileUsersFriends from "./ProfileUsersFriends";
import { useEffect } from "react";
import useAcceptRequest from "../../hooks/useAcceptRequest";

const ProfileRightbar = ({
	userId,
	friendId,
	scrollToPictures,
	openPhotoViewer,
}) => {
	const {
		sendFriendshipButtons,
		currentUserLoading,
		userFriendLoading,
		currentUserError,
		userFriendError,
	} = useFriendRequest(userId, friendId);

	const { acceptFriendshipButtons } = useAcceptRequest();

	const { userFriend } = useGetUsersQuery("usersList", {
		selectFromResult: ({ data }) => ({
			userFriend: data?.entities[friendId],
		}),
	});

	const { currentUser } = useGetUsersQuery("usersList", {
		selectFromResult: ({ data }) => ({
			currentUser: data?.entities[userId],
		}),
	});

	useEffect(() => {
		currentUser?.friendRequests?.includes(friendId);
		currentUser?.friends?.includes(friendId);

		userFriend?.friendReceiver?.includes(userId);
		userFriend?.friends?.includes(userId);
	}, [friendId, userId, currentUser]);

	return (
		<>
			<div className="rightbarButton">
				{userId !== friendId && (
					<div>
						{userFriend?.friendRequests?.includes(userId)
							? acceptFriendshipButtons()
							: sendFriendshipButtons()}
					</div>
				)}
			</div>
			<h4 className="rightbarTitle">{currentUser?.username} albium</h4>
			<div className="rightbarFollowings">
				{currentUser?.media?.length ? (
					<ProfileUsersFriends
						currentUser={currentUser}
						scrollToPictures={scrollToPictures}
					/>
				) : (
					<p>you don't have current Users add friends</p>
				)}
			</div>
		</>
	);
};

export default ProfileRightbar;
