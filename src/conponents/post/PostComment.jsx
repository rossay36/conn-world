import Comments from "../comment/Comments";
import { format } from "timeago.js";
// const IMG_URL = import.meta.env.VITE_PUBLIC_FOLDER;
import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { useGetCommentsQuery } from "../../features/homes/commentApiSlice";
import MediaImageAndVideoController from "../mediaImageAndVideoController/MediaImageAndVideoController";

const PostComment = ({ post, openPhotoViewer, scrollToPictures, comments }) => {
	const { username, userId } = useAuth();

	const {
		data: comment,
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
		<ul className="comment_item">
			<div className="comment_center">
				<div className="comment_userProfile">
					<div className="comment_post_profile">
						<Link to={`/home/${post?.user}`} onClick={scrollToPictures}>
							<img
								className="postProfileImg"
								src={
									post?.profilePicture
										? post?.profilePicture
										: "/images/avatar2.png"
								}
								alt=""
							/>
						</Link>
						<span className="postUsername">{post?.username}</span>
					</div>
					<div className="comment_time_date">
						<span>{format(post?.createdAt)}</span>
					</div>
				</div>
				{post?.text?.length && <p className="postText">{post?.text}</p>}
				<div className="postMediaContainer">
					<MediaImageAndVideoController
						mediaUrls={post?.image}
						onClick={openPhotoViewer}
					/>
				</div>
			</div>
			<p className="comment_title">
				{!post?.comments?.length
					? "no comments"
					: post?.comments?.length === 1
					? `${post?.comments?.length} comment`
					: `${post?.comments?.length} comments`}
			</p>
			<hr className="comment_hr"></hr>
			{post?.comments?.map((commentId) => (
				<Comments
					key={commentId}
					commentId={commentId}
					openPhotoViewer={openPhotoViewer}
					comments={comments}
				/>
			))}
		</ul>
	);
};

export default PostComment;
