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
		<div className="friendAccept">
			{currentUser?.friendReceiver?.length ? (
				<>
					<p className="friendAccept_title">
						{currentUser?.friendReceiver.length === 1
							? `${currentUser?.friendReceiver.length} Friend Request`
							: "Friend Requests"}
					</p>
					{currentUser?.friendReceiver?.map((requestId) => (
						<AcceptFriends key={requestId} requestId={requestId} />
					))}
				</>
			) : (
				"No Friend Request"
			)}
		</div>
	);
};

export default FriendAccept;
