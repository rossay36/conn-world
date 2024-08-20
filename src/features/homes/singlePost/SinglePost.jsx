import "./SinglePost.css";
import Leftbar from "../../../conponents/leftbar/Leftbar";
import Rigthbar from "../../../conponents/rightbar/Rigthbar";
import useAuth from "../../../hooks/useAuth";
import PostComment from "../../../conponents/post/PostComment";
import PostLikes from "../../../conponents/comment/PostLikes";

import { useGetPostsQuery } from "../postsApiSlice";
import { Link, useParams } from "react-router-dom";
import { MdMoreVert, MdOutlineComment } from "react-icons/md";
import { format } from "timeago.js";
import { useEffect, useRef, useState } from "react";
import { getStorage, ref, getMetadata } from "firebase/storage";
import SinglePostForm from "./SinglePostForm";
import { useGetCommentsQuery } from "../commentApiSlice";
import SinglePostComment from "./SinglePostComment";
import MediaImageAndVideoController from "../../../conponents/mediaImageAndVideoController/MediaImageAndVideoController";
const IMG_URL = import.meta.env.VITE_PUBLIC_FOLDER;

const SinglePost = () => {
	const { postId } = useParams();
	const { userId } = useAuth();

	const { post, isLoading, error, refetch } = useGetPostsQuery("postsList", {
		selectFromResult: ({ data }) => ({
			post: data?.entities[postId],
		}),
	});

	const handleCommentAdded = () => {
		refetch(); // Refetch comments to get the latest updates
	};
	const [mediaTypes, setMediaTypes] = useState({});
	const [isMuted, setIsMuted] = useState(true); // Default to muted
	const videoRefs = useRef({}); // To keep track of video elements

	useEffect(() => {
		// Fetch media types from Firebase Storage
		const fetchMediaTypes = async () => {
			if (!post?.image || !Array.isArray(post.image)) {
				console.warn("No images available or post.image is not an array.");
				return;
			}
			const mediaTypePromises = post?.image?.map(async (mediaUrl) => {
				const storage = getStorage();
				const storageRef = ref(storage, mediaUrl);
				try {
					const metadata = await getMetadata(storageRef);
					return { url: mediaUrl, type: metadata.contentType };
				} catch (error) {
					console.error("Error fetching metadata:", error);
					return { url: mediaUrl, type: null };
				}
			});
			const mediaTypeResults = await Promise.all(mediaTypePromises);
			const mediaTypesMap = mediaTypeResults.reduce((acc, { url, type }) => {
				acc[url] = type;
				return acc;
			}, {});
			setMediaTypes(mediaTypesMap);
		};

		fetchMediaTypes();
	}, [post?.image]);

	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					const video = videoRefs.current[entry.target.src];
					if (video) {
						if (entry.isIntersecting) {
							video.play();
							video.muted = isMuted;
						} else {
							video.pause();
							video.currentTime = 0; // Optional: reset the video to the beginning
						}
					}
				});
			},
			{ threshold: 0.5 } // Play video if at least 50% of it is visible
		);

		Object.values(videoRefs.current).forEach((video) => {
			if (video) observer.observe(video);
		});

		return () => {
			Object.values(videoRefs.current).forEach((video) => {
				if (video) observer.unobserve(video);
			});
		};
	}, [post?.image, isMuted]); // Re-run when `isMuted` changes

	const handleSingleMute = () => {
		setIsMuted((prevMuted) => {
			const newMuted = !prevMuted;
			// Update all videos to the new mute state
			Object.values(videoRefs.current).forEach((video) => {
				if (video) {
					video.muted = newMuted;
				}
			});
			return newMuted;
		});
	};

	// comming from post logics, like handles and some comment

	const [comments, setComments] = useState([]);
	const [photoViewerOpen, setPhotoViewerOpen] = useState(false);
	const [selectedPhoto, setSelectedPhoto] = useState(null);

	const scrollToPictures = () => {
		profileSectionRef.current.scrollIntoView({
			behavior: "smooth",
			block: "start",
		});
	};
	const profileSectionRef = useRef(null);

	useEffect(() => {
		if (post) {
			setComments(post.comments); // Ensure comments is set to an empty array if undefined
		}
	}, [post]); // Only depend on post

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
		<div className="singlePost">
			<div className="singlePost_leftbar">
				<Leftbar />
			</div>
			<div className="singlePost_container">
				<div className="singlePost_wrapp">
					<div className="SingPost_scroll">
						<div className="singlePost_top">
							<div className="singlePost_Left">
								<Link to={`/home/${post?.user}`}>
									<img
										className="singlePost_img"
										src={
											post?.profilePicture
												? post?.profilePicture
												: IMG_URL + "/avatar2.png"
										}
										alt=""
									/>
								</Link>
								<span className="singlePost_username">{post?.username}</span>
								<span className="singlePost_date">
									{format(post?.createdAt)}
								</span>
							</div>
							<div className="singlePost_Top_Right">
								<MdMoreVert />
							</div>
						</div>
						<div className="singlePost_Center">
							<header className="postText_container">
								<p className="postText">{post?.text}</p>
							</header>
							<div className="singlePost_MediaContainer">
								<MediaImageAndVideoController mediaUrls={post?.image} />
							</div>
						</div>
						<div className="singlepost_Bottom">
							<PostLikes
								postId={postId}
								post={post}
								scrollToPictures={scrollToPictures}
							/>
							<>
								<span className="commment_text_comment">
									<p>{post?.comments?.length}</p>
									<MdOutlineComment className="commment_icons" />
								</span>
							</>
						</div>
						<div className="singlePost_comment_wrapper">
							<SinglePostComment
								postId={postId}
								post={post}
								openPhotoViewer={openPhotoViewer}
								scrollToPictures={scrollToPictures}
								comments={comments}
							/>
						</div>
					</div>
					<SinglePostForm post={post} handleCommentAdded={handleCommentAdded} />
				</div>
			</div>
			<div className="singlePost_rightbar">
				<Rigthbar />
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

export default SinglePost;
