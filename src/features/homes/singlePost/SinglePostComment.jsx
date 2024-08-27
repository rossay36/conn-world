import Comments from "../../../conponents/comment/Comments";
import { format } from "timeago.js";
// const IMG_URL = import.meta.env.VITE_PUBLIC_FOLDER;
import { Link } from "react-router-dom";
import { getStorage, ref, getMetadata } from "firebase/storage";
import { useEffect, useState } from "react";
import useAuth from "../../../hooks/useAuth";
import { useGetCommentsQuery } from "../commentApiSlice";

const PostComment = ({ commentId, post, scrollToPictures, comments }) => {
	const { username, userId } = useAuth();

	const [singlePost, setSinglePost] = useState([]);

	useEffect(() => {
		setSinglePost(post?.comments);
	}, [post?.comments]);

	const {
		data,
		isLoading: postsLoading,
		isError: postsError,
		isSuccess: postsSuccess,
		error: postsErrorData,
		refetch,
	} = useGetCommentsQuery("postsList", {
		pollingInterval: 3000,
		refetchOnFocus: true,
		refetchOnMountOrArgChange: true,
	});

	return (
		<>
			<div className="single_comment_title_container">
				<span className="single_comment_title_text">Comments</span>
			</div>
			<ul className="comment_item">
				<div className="comment_center"></div>
				{singlePost?.map((commentId) => (
					<Comments
						key={commentId}
						commentId={commentId}
						// openPhotoViewer={openPhotoViewer}
					/>
				))}
			</ul>
		</>
	);
};

export default PostComment;
