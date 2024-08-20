import React from "react";
import { RingLoader } from "react-spinners";
import FriendsRequest from "../../../conponents/friendsRequest/FriendsRequest";
import { useGetUsersQuery } from "../../profile/usersApiSlice";
import useAuth from "../../../hooks/useAuth";
import { selectShowfriendsOrFeedComponent } from "../../auth/authSlice";
import { useSelector } from "react-redux";

const Users = () => {
	const showfriendsOrFeedComponent = useSelector(
		selectShowfriendsOrFeedComponent
	);
	// const { userId } = useAuth();
	const {
		data: friendRequests,
		isError,
		error,
		isLoading,
		isSuccess,
		refetch,
	} = useGetUsersQuery("usersList", {
		pollingInterval: 5000,
		refetchOnFocus: true,
		refetchOnMountOrArgChange: true,
	}); // Replace with appropriate query hook

	let content;

	if (isLoading) {
		content = <RingLoader size={20} margin="auto" color="#fff" />;
	}

	if (isError) {
		content = <p>{error?.data?.message}</p>;
	}

	if (isSuccess) {
		const { ids } = friendRequests;

		<h2>Friend Requests</h2>;
		content = ids?.map((friendId) => (
			<FriendsRequest key={friendId} friendId={friendId} />
		));
	} else {
		return null;
	}

	return (
		<div
			className={showfriendsOrFeedComponent ? "users_list_toggle" : "user_list"}
		>
			<div className="users_list_addFriends">
				<h3 className="users_list_addFriends_text">
					Follow And Unfollow Frinds List
				</h3>
				<input
					className="users_list_addFriends_input"
					placeholder="Search for Frineds"
				/>
			</div>
			{content}
		</div>
	);
};

export default Users;
