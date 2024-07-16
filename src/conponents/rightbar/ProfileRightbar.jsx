import "./rightbar.css";
import useFriendRequest from "../../hooks/useFriedRequest";
import { useGetUsersQuery } from "../../features/profile/usersApiSlice";
import ProfileUsersFriends from "./ProfileUsersFriends";
import useAuth from "../../hooks/useAuth";
import { useParams } from "react-router-dom";
import { useEffect } from "react";

const ProfileRightbar = ({ userId, friendId, scrollToPictures }) => {
	const {
		sendFriendshipButtons,
		acceptFriendshipButtons,

		currentUserLoading,
		userFriendLoading,
		currentUserError,
		userFriendError,
	} = useFriendRequest(userId, friendId);

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

	// const { friendUser } = useGetUsersQuery("usersList", {
	// 	selectFromResult: ({ data }) => ({
	// 		friendUser: data?.entities[usersdIds],
	// 	}),
	// });

	// console.log("friend", userFriend);
	// console.log("my Id", userId);

	useEffect(() => {
		currentUser?.friendRequests?.includes(friendId);
		currentUser?.friends?.includes(friendId);

		userFriend?.friendReceiver?.includes(userId);
		userFriend?.friends?.includes(userId);
	}, [friendId, userId, currentUser]);

	// const filteredId = userFriend?.friendRequests?.filter(
	// 	(user) => user.toString() === userId
	// );

	// if (filteredId?.length > 0) {
	// 	console.log("filtered ID:", filteredId[0]);
	// } else {
	// 	console.log("No matching ID found.");
	// }

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

			<h4 className="rightbarTitle"> Address</h4>
			<div className="rightbarInfo">
				<div className="rightbarInfoItem">
					<span className="rightbarInfoKey">Country:</span>
					<span className="rightbarInfoValue">
						{currentUser?.address?.country}
					</span>
				</div>
				<div className="rightbarInfoItem">
					<span className="rightbarInfoKey">State:</span>
					<span className="rightbarInfoValue">
						{currentUser?.address?.state}
					</span>
				</div>
				<div className="rightbarInfoItem">
					<span className="rightbarInfoKey">City:</span>
					<span className="rightbarInfoValue">
						{currentUser?.address?.city}
					</span>
				</div>
				<div className="rightbarInfoItem">
					<span className="rightbarInfoKey">Street:</span>
					<span className="rightbarInfoValue">
						{currentUser?.address?.street}
					</span>
				</div>
				<div className="rightbarInfoItem">
					<span className="rightbarInfoKey">Relationship:</span>
					<span className="rightbarInfoValue">Single</span>
				</div>
			</div>
			<h4 className="rightbarTitle">User friends</h4>
			<div className="rightbarFollowings">
				{userFriend?.friends?.length ? (
					userFriend?.friends?.map((user) => (
						<ProfileUsersFriends
							key={user}
							user={user}
							scrollToPictures={scrollToPictures}
						/>
					))
				) : (
					<p>you don't have current Users add friends</p>
				)}
			</div>
		</>
	);
};

export default ProfileRightbar;
