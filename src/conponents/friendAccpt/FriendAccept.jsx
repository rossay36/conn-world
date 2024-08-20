import useAuth from "../../hooks/useAuth";
import "./FriendAccept.css";
import { useGetUsersQuery } from "../../features/profile/usersApiSlice";
import AcceptFriends from "./AcceptFriends";

const FriendAccept = () => {
	const { userId } = useAuth();

	const { currentUser } = useGetUsersQuery("usersList", {
		selectFromResult: ({ data }) => ({
			currentUser: data?.entities[userId],
		}),
	});

	return (
		<>
			{currentUser?.friendReceiver?.length === 0 ? null : (
				<div className="friendAccept">
					{currentUser?.friendReceiver?.length ? (
						<>
							<header className="friendAccept_title">
								<span className="friendAccept_length_text">
									{currentUser?.friendReceiver.length}
								</span>

								<span className="friendAccept_length_text">
									{currentUser?.friendReceiver.length === 1
										? `${currentUser?.friendReceiver.length} Friend Request`
										: "Friend Requests"}
								</span>
							</header>
							{currentUser?.friendReceiver?.map((friendId) => (
								<AcceptFriends
									key={friendId}
									friendId={friendId}
									userId={currentUser?._id}
								/>
							))}
						</>
					) : (
						"No Friend Request"
					)}
				</div>
			)}
		</>
	);
};

export default FriendAccept;
