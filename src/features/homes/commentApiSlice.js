import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";
const commentsAdapter = createEntityAdapter({
	sortComparer: (a, b) => {
		return new Date(b.createdAt) - new Date(a.createdAt);
	},
});

const initialState = commentsAdapter.getInitialState();

export const commentsApiSlice = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		getComments: builder.query({
			query: () => ({
				url: "/comments",
				validateStatus: (response, result) => {
					return response.status === 200 && !result.isError;
				},
			}),
			transformResponse: (responseData) => {
				const loadedComments = responseData.map((comment) => {
					comment.id = comment._id;
					return comment;
				});
				return commentsAdapter.setAll(initialState, loadedComments);
			},
			providesTags: (result, error, arg) => {
				if (result?.ids) {
					return [
						{ type: "Comment", id: "LIST" },
						...result.ids.map((id) => ({ type: "Comment", id })),
					];
				} else return [{ type: "Comment", id: "LIST" }];
			},
		}),
		addNewComment: builder.mutation({
			query: (initialCommentData) => ({
				url: "/comments",
				method: "POST",
				body: {
					...initialCommentData,
				},
			}),
			invalidatesTags: [{ type: "Comment", id: "LIST" }],
		}),
		updateComment: builder.mutation({
			query: (initialCommentData) => ({
				url: "/comments",
				method: "PUT",
				body: {
					...initialCommentData,
				},
			}),
			invalidatesTags: (result, error, arg) => [
				{ type: "Comment", id: arg.id },
			],
		}),
		deleteComment: builder.mutation({
			query: ({ id }) => ({
				url: `/comments`,
				method: "DELETE",
				body: { id },
			}),
			invalidatesTags: (result, error, arg) => [
				{ type: "Comment", id: arg.id },
			],
		}),
		likeComment: builder.mutation({
			query: (commentId) => ({
				url: `/comments/${commentId}/like`,
				method: "POST",
			}),
			invalidatesTags: [{ type: "Comment", id: "LIST" }],
			onQueryStarted: (commentId, { dispatch, getState }) => {
				// Implement loading state if needed
			},
			onQueryCompleted: (commentId, { dispatch, getState, data }) => {
				// Update the store after successfully liking a comment
				const existingComment = selectCommentById(getState(), commentId);
				if (existingComment) {
					dispatch(
						commentsApiSlice.util.updateQueryData(
							"getComments",
							undefined,
							(draft) => {
								const updatedComment = {
									...existingComment,
									likes: data.likes,
								};
								return commentsAdapter.updateOne(draft, updatedComment);
							}
						)
					);
				}
			},
		}),
		unlikeComment: builder.mutation({
			query: (commentId) => ({
				url: `/comments/${commentId}/unlike`,
				method: "POST",
			}),
			invalidatesTags: [{ type: "Comment", id: "LIST" }],
			onQueryStarted: (commentId, { dispatch, getState }) => {
				// Implement loading state if needed
			},
			onQueryCompleted: (commentId, { dispatch, getState, data }) => {
				// Update the store after successfully unliking a comment
				const existingComment = selectCommentById(getState(), commentId);
				if (existingComment) {
					dispatch(
						commentsApiSlice.util.updateQueryData(
							"getComments",
							undefined,
							(draft) => {
								const updatedComment = {
									...existingComment,
									likes: data.likes,
								};
								return commentsAdapter.updateOne(draft, updatedComment);
							}
						)
					);
				}
			},
		}),
	}),
});

export const {
	useGetCommentsQuery,
	useAddNewCommentMutation,
	useUpdateCommentMutation,
	useDeleteCommentMutation,
	useLikeCommentMutation,
	useUnlikeCommentMutation,
} = commentsApiSlice;

// returns the query result object
export const selectCommentsResult =
	commentsApiSlice.endpoints.getComments.select();

// creates memoized selector
const selectCommentsData = createSelector(
	selectCommentsResult,
	(commentsResult) => commentsResult.data // normalized state object with ids & entities
);

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
	selectAll: selectAllComments,
	selectById: selectCommentById,
	selectIds: selectCommentIds,
	// Pass in a selector that returns the comments slice of state
} = commentsAdapter.getSelectors(
	(state) => selectCommentsData(state) ?? initialState
);
