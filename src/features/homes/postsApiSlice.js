import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";
const postsAdapter = createEntityAdapter({
	sortComparer: (a, b) => {
		return new Date(b.createdAt) - new Date(a.createdAt);
	},
});

const initialState = postsAdapter.getInitialState();

export const postsApiSlice = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		getPosts: builder.query({
			query: () => ({
				url: "/posts",
				validateStatus: (response, result) => {
					return response.status === 200 && !result.isError;
				},
			}),
			transformResponse: (responseData) => {
				const loadedPosts = responseData.map((post) => {
					post.id = post._id;
					return post;
				});
				return postsAdapter.setAll(initialState, loadedPosts);
			},
			providesTags: (result, error, arg) => {
				if (result?.ids) {
					return [
						{ type: "Post", id: "LIST" },
						...result.ids.map((id) => ({ type: "Post", id })),
					];
				} else return [{ type: "Post", id: "LIST" }];
			},
		}),
		addNewPost: builder.mutation({
			query: (initialPostData) => ({
				url: "/posts",
				method: "POST",
				body: {
					...initialPostData,
				},
			}),
			invalidatesTags: [{ type: "Post", id: "LIST" }],
		}),
		updatePost: builder.mutation({
			query: (initialPostData) => ({
				url: "/posts",
				method: "PATCH",
				body: {
					...initialPostData,
				},
			}),
			invalidatesTags: (result, error, arg) => [{ type: "Post", id: arg.id }],
		}),
		deletePost: builder.mutation({
			query: ({ id }) => ({
				url: `/posts`,
				method: "DELETE",
				body: { id },
			}),
			invalidatesTags: (result, error, arg) => [{ type: "Post", id: arg.id }],
		}),
		likePost: builder.mutation({
			query: (postId) => ({
				url: `/posts/${postId}/like`,
				method: "POST",
			}),
			invalidatesTags: [{ type: "Post", id: "LIST" }],
			onQueryStarted: (postId, { dispatch, getState }) => {
				// Implement loading state if needed
			},
			onQueryCompleted: (postId, { dispatch, getState, data }) => {
				// Update the store after successfully liking a post
				const existingPost = selectPostById(getState(), postId);
				if (existingPost) {
					dispatch(
						postsApiSlice.util.updateQueryData(
							"getPosts",
							undefined,
							(draft) => {
								const updatedPost = { ...existingPost, likes: data.likes };
								return postsAdapter.updateOne(draft, updatedPost);
							}
						)
					);
				}
			},
		}),
		unlikePost: builder.mutation({
			query: (postId) => ({
				url: `/posts/${postId}/unlike`,
				method: "POST",
			}),
			invalidatesTags: [{ type: "Post", id: "LIST" }],
			onQueryStarted: (postId, { dispatch, getState }) => {
				// Implement loading state if needed
			},
			onQueryCompleted: (postId, { dispatch, getState, data }) => {
				// Update the store after successfully unliking a post
				const existingPost = selectPostById(getState(), postId);
				if (existingPost) {
					dispatch(
						postsApiSlice.util.updateQueryData(
							"getPosts",
							undefined,
							(draft) => {
								const updatedPost = { ...existingPost, likes: data.likes };
								return postsAdapter.updateOne(draft, updatedPost);
							}
						)
					);
				}
			},
		}),
	}),
});

export const {
	useGetPostsQuery,
	useAddNewPostMutation,
	useUpdatePostMutation,
	useDeletePostMutation,
	useLikePostMutation,
	useUnlikePostMutation,
} = postsApiSlice;

// returns the query result object
export const selectPostsResult = postsApiSlice.endpoints.getPosts.select();

// creates memoized selector
const selectPostsData = createSelector(
	selectPostsResult,
	(postsResult) => postsResult.data // normalized state object with ids & entities
);

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
	selectAll: selectAllPosts,
	selectById: selectPostById,
	selectIds: selectPostIds,
	// Pass in a selector that returns the posts slice of state
} = postsAdapter.getSelectors(
	(state) => selectPostsData(state) ?? initialState
);
