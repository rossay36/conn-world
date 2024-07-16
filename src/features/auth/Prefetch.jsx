import { postsApiSlice } from "../homes/postsApiSlice";
import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { usersApiSlice } from "../profile/usersApiSlice";
import { commentsApiSlice } from "../homes/commentApiSlice";
import { store } from "../../app/store";

const Prefetch = () => {
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
	}, []);

	return <Outlet />;
};
export default Prefetch;
