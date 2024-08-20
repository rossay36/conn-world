import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";
// Create an adapter for messages with optional sorting
const messagesAdapter = createEntityAdapter({
	// Uncomment and adjust if you want to sort messages by creation date
	// sortComparer: (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
});

// Initial state for the messages slice
const initialState = messagesAdapter.getInitialState();

export const messagesApiSlice = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		// Fetch messages between users
		getMessages: builder.query({
			query: (recipientId) => ({
				url: `/messages/${recipientId}`,
			}),
			transformResponse: (responseData) => {
				const loadedMessages = responseData.map((message) => {
					message.id = message._id; // Map _id to id
					return message;
				});
				return messagesAdapter.setAll(initialState, loadedMessages); // Normalize and set messages
			},
			providesTags: (result) => {
				if (result?.ids) {
					return [
						{ type: "Message", id: "LIST" },
						...result.ids.map((id) => ({ type: "Message", id })),
					];
				} else return [{ type: "Message", id: "LIST" }];
			},
		}),
		// Send a message
		sendMessage: builder.mutation({
			query: (messageData) => ({
				url: "/messages",
				method: "POST",
				body: messageData,
			}),
			invalidatesTags: [{ type: "Message", id: "LIST" }],
		}),
		// Delete a message
		deleteMessage: builder.mutation({
			query: ({ messageId, forBoth }) => ({
				url: "/messages",
				method: "DELETE",
				body: { messageId, forBoth },
			}),
			invalidatesTags: [{ type: "Message", id: "LIST" }],
		}),
		// Edit a message
		editMessage: builder.mutation({
			query: ({ messageId, newText }) => ({
				url: "/messages",
				method: "PATCH",
				body: { messageId, newText },
			}),
			invalidatesTags: [{ type: "Message", id: "LIST" }],
		}),
		// Clear chat between users
		clearChat: builder.mutation({
			query: (recipientId) => ({
				url: "/messages/clear",
				method: "DELETE",
				body: { recipient: recipientId },
			}),
			invalidatesTags: [{ type: "Message", id: "LIST" }],
		}),
	}),
});

// Export hooks for each endpoint
export const {
	useGetMessagesQuery,
	useSendMessageMutation,
	useDeleteMessageMutation,
	useEditMessageMutation,
	useClearChatMutation,
} = messagesApiSlice;

// Selectors
export const selectMessagesResult =
	messagesApiSlice.endpoints.getMessages.select();

// Create a memoized selector for messages
const selectMessagesData = createSelector(
	selectMessagesResult,
	(messagesResult) => messagesResult.data // Access normalized data
);

// Get selectors from the messages adapter
export const {
	selectAll: selectAllMessages,
	selectById: selectMessageById,
	selectIds: selectMessageIds,
} = messagesAdapter.getSelectors(
	(state) => selectMessagesData(state) ?? initialState
);
