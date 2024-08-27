import "./posts.css";
import { memo, useEffect, useRef, useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import useAuth from "../../hooks/useAuth";

import {
	useGetPostsQuery,
	useLikePostMutation,
	useUnlikePostMutation,
} from "../../features/homes/postsApiSlice";
import PostComment from "./PostComment";
import PostDetails from "../PostDetails";
import PostLikes from "../comment/PostLikes";
import { RingLoader } from "react-spinners";
import CommentForm from "../commentForm/CommentForm";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { MdOutlineComment } from "react-icons/md";

const ProfilePost = ({ postId, scrollToPictures, profilePostId }) => {
	const { post, isLoading, error } = useGetPostsQuery("postsList", {
		selectFromResult: ({ data }) => ({
			post: data?.entities[postId],
		}),
	});
	const [comments, setComments] = useState([]);
	const [isOpen, setIsOpen] = useState(false);

	const [like, setLike] = useState(post?.likes?.length || 0);
	const [isLiked, setIsLiked] = useState(false);
	const [likersVisible, setLikersVisible] = useState(false); // State to toggle dropdown visibility
	const [likers, setLikers] = useState([]); // State to store users who liked the post
	const [photoViewerOpen, setPhotoViewerOpen] = useState(false);
	const [selectedPhoto, setSelectedPhoto] = useState(null);
	const commentContainerRef = useRef(null); // Reference to the comment component

	const [likePostMutation] = useLikePostMutation();
	const [unlikePostMutation] = useUnlikePostMutation();

	const { userId } = useAuth();
	useEffect(() => {
		setIsLiked(post?.likes?.includes(userId));
	}, [post?.likes, userId]);

	useEffect(() => {
		// Set initial list of likers when post data loads
		if (post) {
			setLikers(post.likes);
		}
	}, [post]);

	useEffect(() => {
		if (post) {
			setComments(post?.comments);
		}
	}, [post]);

	// Effect to handle click outside of comment section
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (
				commentContainerRef.current &&
				!commentContainerRef.current.contains(event.target)
			) {
				setIsOpen(false);
			}
		};

		document.addEventListener("click", handleClickOutside);

		return () => {
			document.removeEventListener("click", handleClickOutside);
		};
	}, []);
	const toggleDropdown = (event) => {
		event.stopPropagation(); // Prevents event from propagating to other click listeners
		setIsOpen((prevIsOpen) => !prevIsOpen);
	};

	const likeHandler = async () => {
		try {
			if (isLiked) {
				await unlikePostMutation(postId);
				setLike((prev) => prev - 1);
				setLikers((prev) => prev.filter((id) => id !== userId));
			} else {
				await likePostMutation(postId);
				setLike((prev) => prev + 1);
				setLikers((prev) => [...prev, userId]);
			}
			setIsLiked((prev) => !prev);
		} catch (error) {
			console.error("Error handling like:", error); // checking error
		}
	};

	const toggleLikersVisible = () => {
		setLikersVisible((prev) => !prev);
	};

	if (isLoading) {
		return (
			<div
				style={{
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
				}}
			>
				<ClipLoader />
			</div>
		);
	}

	if (error) {
		return <div>Error: {error.message}</div>;
	}

	return (
		<div className="post">
			<div className="postWrapper">
				<PostDetails post={post} scrollToPictures={scrollToPictures} />
				<div className="postBottom">
					<PostLikes
						post={post}
						postId={postId}
						scrollToPictures={scrollToPictures}
					/>
					<>
						{isOpen && (
							<div className="PostComment_container" ref={commentContainerRef}>
								<p className="postComment_topbar">{`${post?.username} Post And Comments`}</p>
								<div className="postComment_container_top">
									<PostComment
										post={post}
										scrollToPictures={scrollToPictures}
										isOpen={isOpen}
										comments={comments}
									/>
								</div>
								<CommentForm post={post} />
							</div>
						)}
						<div className="commment__toggle" onClick={toggleDropdown}>
							<span className="commment_text_comment">
								<p>{post?.comments?.length}</p>
								<MdOutlineComment className="commment_icons" />
								{isOpen ? (
									<IoIosArrowUp className="comment_icons" />
								) : (
									<IoIosArrowDown className="comment_icons" />
								)}
							</span>
						</div>
					</>
				</div>
			</div>
		</div>
	);
};

const memoizedProfilePost = memo(ProfilePost);

export default memoizedProfilePost;
