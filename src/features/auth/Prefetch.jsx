import { postsApiSlice } from "../homes/postsApiSlice";
import { useEffect } from "react";
import { Outlet, useParams } from "react-router-dom";
import { usersApiSlice } from "../profile/usersApiSlice";
import { commentsApiSlice } from "../homes/commentApiSlice";
import { messagesApiSlice } from "../messenger/messageApi";
import { store } from "../../app/store";

const Prefetch = () => {
	const { recipientId } = useParams(); // Extract recipientId from route parameters
	useEffect(() => {
		store.dispatch(
			postsApiSlice.util.prefetch("getPosts", "postsList", { force: true })
		);
		store.dispatch(
			usersApiSlice.util.prefetch("getUsers", "usersList", { force: true })
		);
		store.dispatch(
			commentsApiSlice.util.prefetch("getComments", "commentsList", {
				force: true,
			})
		);
		// Conditionally prefetch messages if recipientId is available and valid
		if (recipientId) {
			store.dispatch(
				messagesApiSlice.util.prefetch("getMessages", recipientId, {
					force: true,
				})
			);
		}
	}, [recipientId]); // Depend on recipientId

	return <Outlet />;
};
export default Prefetch;
