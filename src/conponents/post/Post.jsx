import "./posts.css";
import { memo, useEffect, useRef, useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import useAuth from "../../hooks/useAuth";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";

import { useGetPostsQuery } from "../../features/homes/postsApiSlice";
import PostComment from "./PostComment";
import PostDetails from "../PostDetails";
import PostLikes from "../comment/PostLikes";

import CommentForm from "../commentForm/CommentForm";
import { MdOutlineComment } from "react-icons/md";

const Post = ({ postId, scrollToPictures }) => {
	const [comments, setComments] = useState([]);
	const [isOpen, setIsOpen] = useState(false);
	const commentContainerRef = useRef(null); // Reference to the comment component

	const { userId } = useAuth();

	const { post, isLoading, error } = useGetPostsQuery("postsList", {
		selectFromResult: ({ data }) => ({
			post: data?.entities[postId],
		}),
	});

	const [photoViewerOpen, setPhotoViewerOpen] = useState(false);
	const [selectedPhoto, setSelectedPhoto] = useState(null);

	useEffect(() => {
		if (post) {
			setComments(post?.comments);
		}
	}, [post]);

	// Close comment form if it's open
	useEffect(() => {
		if (isOpen) {
			setIsOpen(false);
		}
	}, [postId, post]);

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

	const openPhotoViewer = (imageUrl) => {
		setSelectedPhoto(imageUrl);
		setPhotoViewerOpen(true);
	};

	const closePhotoViewer = () => {
		setSelectedPhoto(null);
		setPhotoViewerOpen(false);
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
				<PostDetails
					post={post}
					scrollToPictures={scrollToPictures}
					openPhotoViewer={openPhotoViewer}
				/>
				<div className="postBottom">
					<PostLikes
						post={post}
						postId={postId}
						scrollToPictures={scrollToPictures}
					/>
					<>
						<div className="PostComment_container" ref={commentContainerRef}>
							{isOpen && (
								<>
									<div className="post_comment_wrapper">
										<PostComment
											post={post}
											openPhotoViewer={openPhotoViewer}
											scrollToPictures={scrollToPictures}
											isOpen={isOpen}
											comments={comments}
										/>
									</div>
									<CommentForm post={post} />
								</>
							)}
						</div>
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
			{photoViewerOpen && (
				<div className={"photoViewerModal"}>
					<img
						src={selectedPhoto}
						alt="Expanded Photo"
						className="expandedPhoto"
					/>
					<button onClick={closePhotoViewer} className="closeButton">
						Close
					</button>
				</div>
			)}
		</div>
	);
};

const memoizedPost = memo(Post);

export default memoizedPost;
