import "./Comments.css";
import { Link } from "react-router-dom";
import { format } from "timeago.js";
import { useGetCommentsQuery } from "../../features/homes/commentApiSlice";
import { useGetUsersQuery } from "../../features/profile/usersApiSlice";
import { useEffect, useRef, useState } from "react";
import { GiSelfLove } from "react-icons/gi";
import { MdOutlineComment } from "react-icons/md";
import { BiRepost } from "react-icons/bi";
import { CiViewBoard } from "react-icons/ci";
import { FaRegShareFromSquare } from "react-icons/fa6";
import { GrTag } from "react-icons/gr";
import { getStorage, ref, getMetadata } from "firebase/storage";
import MediaImageAndVideoController from "../mediaImageAndVideoController/MediaImageAndVideoController";

const IMG_URL = import.meta.env.VITE_PUBLIC_FOLDER;

const Comments = ({ commentId, scrollToPictures, openPhotoViewer }) => {
	// const { comment, isLoading, error } = useGetCommentsQuery("commentsList", {
	// 	selectFromResult: ({ data }) => ({
	// 		comment: data?.entities[commentId],
	// 	}),
	// });

	const {
		comment = {},
		isLoading,
		error,
		refetch,
	} = useGetCommentsQuery("commentsList", {
		pollingInterval: 5000,
		refetchOnFocus: true,
		refetchOnMountOrArgChange: true,
		selectFromResult: ({ data }) => ({
			comment: data?.entities[commentId] || {},
		}),
	});

	useEffect(() => {
		refetch();
	}, [comment]);

	const { user } = useGetUsersQuery("usersList", {
		selectFromResult: ({ data }) => ({
			user: data?.entities[comment?.user] || {},
		}),
	});

	const [mediaTypes, setMediaTypes] = useState({});
	const [isMuted, setIsMuted] = useState(true); // Default to muted
	const videoRefs = useRef({}); // To keep track of video elements

	useEffect(() => {
		// Fetch media types from Firebase Storage
		const fetchMediaTypes = async () => {
			if (!Array.isArray(comment?.commentImage)) {
				console.error("comment.commentImage is not an array or is undefined");
				return;
			}

			const mediaTypePromises = comment.commentImage.map(async (mediaUrl) => {
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

			try {
				const mediaTypeResults = await Promise.all(mediaTypePromises);
				const mediaTypesMap = mediaTypeResults.reduce((acc, { url, type }) => {
					acc[url] = type;
					return acc;
				}, {});
				setMediaTypes(mediaTypesMap);
			} catch (error) {
				console.error("Error processing media types:", error);
			}
		};

		fetchMediaTypes();
	}, [comment?.commentImage, user?.image]); // Add `comment?.commentImage` as a dependency

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
	}, [user?.image, isMuted]); // Re-run when `isMuted` changes

	const handleMuteToggle = () => {
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

	if (isLoading) {
		return <div>Loading comment...</div>;
	}

	if (error) {
		return <div>Error: {error.message}</div>;
	}

	return (
		<div className="comment_colunm">
			<div className="comment_username_container">
				<span className="comment_username_name">{user?.username} </span>
			</div>
			<div className="comment_flex">
				<div className="comment_items">
					<Link to={`/home/${user?._id}`} onClick={scrollToPictures}>
						<img
							src={
								user?.profilePicture
									? user?.profilePicture
									: IMG_URL + "avatar2.png"
							}
							alt="Profile"
							className="comment_img"
						/>
					</Link>
					<span className="comment_name">
						{user?.lastname} {user?.firstname}
					</span>
				</div>
				<span className="comment_date">{format(comment?.createdAt)}</span>
			</div>
			{comment?.desc && <p className="comment_text">{comment?.desc}</p>}
			<MediaImageAndVideoController
				mediaUrls={comment.commentImage}
				onClick={openPhotoViewer}
			/>
			<div className="comment_child_comment_like">
				<p className="comment_child_icon">
					<span className="comment_child_text">32</span>
					<GiSelfLove className="comment_child_icons" title="Like" />
				</p>
				<p className="comment_child_icon">
					<span className="comment_child_text">10</span>
					<BiRepost className="comment_child_icons" title="Repost" />
				</p>
				<p className="comment_child_icon">
					<span className="comment_child_text">900</span>
					<CiViewBoard className="comment_child_icons" title="Viewer" />
				</p>
				<p className="comment_child_icon">
					<FaRegShareFromSquare
						className="comment_child_icons"
						title="Shere Comment"
					/>
				</p>
				<p className="comment_child_icon">
					<GrTag className="comment_child_icons" title="Shere Comment" />
				</p>
				<p className="comment_child_icon">
					<span className="comment_child_text">15</span>
					<MdOutlineComment className="comment_child_icons" title="Comment" />
				</p>
			</div>
		</div>
	);
};

export default Comments;
