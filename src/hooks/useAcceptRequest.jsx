import { useEffect } from "react";
import "./useFriendRequest.css";
import { RingLoader } from "react-spinners";

import {
	useAcceptFriendRequestMutation,
	useRejectFriendRequestMutation,
	useGetUsersQuery,
} from "../features/profile/usersApiSlice";
import useAuth from "./useAuth";

const useAcceptRequest = (friendId) => {
	const { userId } = useAuth();
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

	// console.log("Current User", currentUser?.friendReceiver);
	// console.log("friendId", friendId);

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
		acceptFriendRequest,
		{
			isLoading: acceptLoading,
			isError: acceptError,
			isSuccess: acceptSuccess,
		},
	] = useAcceptFriendRequestMutation();

	const [
		rejectFriendRequest,
		{
			isLoading: rejectLoading,
			isError: rejectError,
			isSuccess: rejectSuccess,
		},
	] = useRejectFriendRequestMutation();

	// useEffect to refetch data on mutations and when currentUser.friendRequests or userFriend.friendRequests change
	useEffect(() => {
		const refetchData = () => {
			refetchCurrentUser();
			refetchUserFriend();
		};

		if (acceptSuccess || rejectSuccess) {
			refetchData();
		}

		if (
			currentUser?.friendReceiver?.includes(friendId) ||
			currentUser?.friends?.includes(friendId) ||
			userFriend?.friendRequests?.includes(userId) ||
			userFriend?.friends?.includes(userId)
		) {
			refetchData();
		}
	}, [
		acceptSuccess,
		rejectSuccess,
		currentUser,
		userFriend,
		refetchCurrentUser,
		refetchUserFriend,
	]);

	const acceptFriendshipButtons = () => {
		if (currentUser?.friendReceiver?.some((id) => id === friendId)) {
			return (
				<div className="accept_buttons">
					<button
						className="accept_btn_accept"
						onClick={() => acceptFriendRequest(friendId)}
						disabled={acceptLoading}
					>
						{acceptLoading ? (
							<RingLoader size={20} margin="auto" color="#000" />
						) : (
							"accept"
						)}
					</button>
					<button
						className="accept_btn_reject"
						onClick={() => rejectFriendRequest(friendId)}
						disabled={rejectLoading}
					>
						{rejectLoading ? (
							<RingLoader size={20} margin="auto" color="#000" />
						) : (
							"reject"
						)}
					</button>
					{renderLoadingError(
						acceptLoading || rejectLoading,
						acceptError || rejectError
					)}
				</div>
			);
		} else {
			return null;
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
		acceptFriendshipButtons,
	};
};

export default useAcceptRequest;
