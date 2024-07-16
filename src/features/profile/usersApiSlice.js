import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";
const usersAdapter = createEntityAdapter({
	sortComparer: (a, b) => {
		return new Date(b.createdAt) - new Date(a.createdAt);
	},
});

const initialState = usersAdapter.getInitialState();

export const usersApiSlice = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		getUsers: builder.query({
			query: () => ({
				url: "/users",
				validateStatus: (response, result) => {
					return response.status === 200 && !result.isError;
				},
			}),
			transformResponse: (responseData) => {
				const loadedUsers = responseData.map((user) => {
					user.id = user._id;
					return user;
				});
				return usersAdapter.setAll(initialState, loadedUsers);
			},
			providesTags: (result, error, arg) => {
				if (result?.ids) {
					return [
						{ type: "User", id: "LIST" },
						...result.ids.map((id) => ({ type: "User", id })),
					];
				} else return [{ type: "User", id: "LIST" }];
			},
		}),
		updateUser: builder.mutation({
			query: (initialUserData) => ({
				url: "/users",
				method: "PATCH",
				body: {
					...initialUserData,
				},
			}),
			invalidatesTags: (result, error, arg) => [{ type: "User", id: arg.id }],
		}),
		deleteUser: builder.mutation({
			query: ({ id }) => ({
				url: `/users`,
				method: "DELETE",
				body: { id },
			}),
			invalidatesTags: (result, error, arg) => [{ type: "User", id: arg.id }],
		}),
		sendFriendRequest: builder.mutation({
			query: ({ userId, friendId }) => ({
				url: "/users/friend-request",
				method: "POST",
				body: { userId, friendId },
			}),
			onQueryStarted: (arg, { dispatch, getState }) => {
				console.log("Sending friend request...");
			},
		}),
		acceptFriendRequest: builder.mutation({
			query: ({ userId, friendId }) => ({
				url: "/users/friend-request/accept",
				method: "POST",
				body: { userId, friendId },
			}),
			onQueryStarted: (arg, { dispatch, getState }) => {
				console.log("Accepting friend request...");
			},
		}),
		rejectFriendRequest: builder.mutation({
			query: ({ userId, friendId }) => ({
				url: "/users/friend-request/reject",
				method: "POST",
				body: { userId, friendId },
			}),
			onQueryStarted: (arg, { dispatch, getState }) => {
				console.log("Rejecting friend request...");
			},
		}),
		cancelFriendRequest: builder.mutation({
			query: ({ userId, friendId }) => ({
				url: "/users/friend-request/cancel",
				method: "POST",
				body: { userId, friendId },
			}),
			onQueryStarted: (arg, { dispatch, getState }) => {
				console.log("Canceling friend request...");
			},
		}),
		unfollowFriendUser: builder.mutation({
			query: ({ userId, friendId }) => ({
				url: "/users/unfollow",
				method: "POST",
				body: { userId, friendId },
			}),
		}),
		updateActiveSlide: builder.mutation({
			query: ({ userId, isActiveSlide }) => ({
				url: "/users/update-slide", // Adjust endpoint as per your backend API
				method: "PUT",
				body: { userId, isActiveSlide }, // Pass the isActiveSlide to the body
			}),
			invalidatesTags: (result, error, arg) => [{ type: "User", id: arg.id }],
		}),
	}),
});

export const {
	useGetUsersQuery,
	useUpdateUserMutation,
	useDeleteUserMutation,
	useSendFriendRequestMutation,
	useAcceptFriendRequestMutation,
	useRejectFriendRequestMutation,
	useCancelFriendRequestMutation,
	useUnfollowFriendUserMutation,
	useUpdateActiveSlideMutation,
} = usersApiSlice;

// returns the query result object
export const selectUsersResult = usersApiSlice.endpoints.getUsers.select();

// creates memoized selector
const selectUsersData = createSelector(
	selectUsersResult,
	(usersResult) => usersResult.data // normalized state object with ids & entities
);

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
	selectAll: selectAllUsers,
	selectById: selectUserById,
	selectIds: selectUserIds,
	// Pass in a selector that returns the users slice of state
} = usersAdapter.getSelectors(
	(state) => selectUsersData(state) ?? initialState
);
