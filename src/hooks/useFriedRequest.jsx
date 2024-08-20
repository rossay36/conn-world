import { useEffect } from "react";
import "./useFriendRequest.css";
import { RingLoader } from "react-spinners";

import {
	useSendFriendRequestMutation,
	useCancelFriendRequestMutation,
	useUnfollowFriendUserMutation,
	useGetUsersQuery,
} from "../features/profile/usersApiSlice";

const useFriendRequest = (userId, friendId) => {
	const {
		currentUser,
		isLoading: currentUserLoading,
		isError: currentUserError,
		refetch: refetchCurrentUser,
	} = useGetUsersQuery("usersList", {
		selectFromResult: ({ data }) => ({
			currentUser: data?.entities[userId],
		}),
	});

	const {
		userFriend,
		isLoading: userFriendLoading,
		isError: userFriendError,
		refetch: refetchUserFriend,
	} = useGetUsersQuery("usersList", {
		selectFromResult: ({ data }) => ({
			userFriend: data?.entities[friendId],
		}),
	});

	const [
		sendFriendRequest,
		{ isLoading: sendLoading, isError: sendError, isSuccess: sendSuccess },
	] = useSendFriendRequestMutation();

	const [
		cancelFriendRequest,
		{
			isLoading: cancelLoading,
			isError: cancelError,
			isSuccess: cancelSuccess,
		},
	] = useCancelFriendRequestMutation();

	const [
		unfollowFriendUser,
		{
			isLoading: unfollowLoading,
			isError: unfollowError,
			isSuccess: unfollowSuccess,
		},
	] = useUnfollowFriendUserMutation();

	// useEffect to refetch data on mutations and when currentUser.friendRequests or userFriend.friendRequests change
	useEffect(() => {
		const refetchData = () => {
			refetchCurrentUser();
			refetchUserFriend();
		};

		if (sendSuccess || cancelSuccess || unfollowSuccess) {
			refetchData();
		}

		if (
			currentUser?.friendReceiver?.includes(userId) ||
			currentUser?.friends?.includes(userId) ||
			userFriend?.friendReceiver?.includes(friendId) ||
			userFriend?.friends?.includes(friendId)
		) {
			refetchData();
		}
	}, [
		sendSuccess,
		cancelSuccess,
		unfollowSuccess,
		currentUser,
		userFriend,
		refetchCurrentUser,
		refetchUserFriend,
		friendId,
		userId,
	]);

	// Render friendship buttons based on userFriend data
	const sendFriendshipButtons = () => {
		if (!currentUser || !userFriend) {
			return null;
		}

		if (currentUser?.friends?.includes(friendId)) {
			return (
				<>
					<button
						className="send_btn_unfollow"
						onClick={() => unfollowFriendUser({ userId, friendId })}
						disabled={unfollowLoading}
					>
						{unfollowLoading ? (
							<RingLoader size={20} margin="auto" color="#000" />
						) : (
							"unfollow"
						)}
					</button>
					{renderLoadingError(unfollowLoading, unfollowError)}
				</>
			);
		} else if (
			!currentUser?.friendRequests?.includes(friendId) &&
			!userFriend?.friendReceiver?.includes(userId)
		) {
			return (
				<>
					<button
						className="send_btn_follow"
						onClick={() => sendFriendRequest({ userId, friendId })}
						disabled={sendLoading}
					>
						{sendLoading ? (
							<RingLoader size={20} margin="auto" color="#000" />
						) : (
							"follow"
						)}
					</button>
					{renderLoadingError(sendLoading, sendError)}
				</>
			);
		} else {
			return (
				<>
					<button
						className="send_btn_cancel"
						onClick={() => cancelFriendRequest({ userId, friendId })}
						disabled={cancelLoading}
					>
						{cancelLoading ? (
							<RingLoader size={20} margin="auto" color="#000" />
						) : (
							"cancel"
						)}
					</button>
					{renderLoadingError(cancelLoading, cancelError)}
				</>
			);
		}
	};

	const renderLoadingError = (loading, error) => {
		if (error) {
			return (
				<p style={{ color: "red", fontSize: "8px" }}>
					Error: {error?.data?.message}
				</p>
			);
		}
		return null;
	};

	if (currentUserLoading || userFriendLoading) {
		return <RingLoader size={20} margin="auto" color="#000" />;
	}

	if (currentUserError || userFriendError) {
		return (
			<p>
				error:
				{currentUserError?.data?.message || userFriendError?.data?.message}
			</p>
		);
	}

	// Return necessary functions and states for the component using this hook
	return {
		sendFriendshipButtons,
	};
};

export default useFriendRequest;
