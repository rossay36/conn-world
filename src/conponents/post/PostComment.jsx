import Comments from "../comment/Comments";
import { format } from "timeago.js";
const IMG_URL = import.meta.env.VITE_PUBLIC_FOLDER;
import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { useGetCommentsQuery } from "../../features/homes/commentApiSlice";
import { getStorage, ref, getMetadata } from "firebase/storage";
import { useEffect, useState } from "react";

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

	const [mediaTypes, setMediaTypes] = useState({});
	const [isMute, setIsMuste] = useState(true);

	useEffect(() => {
		const fetchMediaTypes = async () => {
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

	const handleMute = () => {
		setIsMuste(!isMute);
	};

	return (
		<>
			<div className="comment_span">
				<span className="comment_spans">Comments</span>
			</div>
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
											: IMG_URL + "/avatar2.png"
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
					{!post?.image?.length ? null : (
						<div
							className={
								post?.image?.length === 2
									? "comment_img_container_double"
									: post?.image?.length === 3
									? "comment_img_container_trepple"
									: post?.image?.length === 4
									? "comment_img_container_four"
									: post?.image?.length > 4
									? "comment_img_container_multiple"
									: "comment_img_container_single"
							}
						>
							{post?.image.map((mediaUrl) => (
								<div key={mediaUrl} className="comment_Media">
									{/* Check if the media is an image or video */}
									{mediaTypes[mediaUrl]?.startsWith("video/") ? (
										<video
											controls
											autoPlay
											muted={isMute}
											loop={true}
											className="postVideo"
											onClick={handleMute}
										>
											<source src={mediaUrl} type={mediaTypes[mediaUrl]} />
											Your browser does not support the video tag.
										</video>
									) : (
										<img
											className={
												post?.image?.length === 2
													? "comment_img_double"
													: post?.image?.length === 3
													? "comment_img_trepple"
													: post?.image?.length === 4
													? "comment_img_four"
													: post?.image?.length > 4
													? "comment_img_multiple"
													: "comment_image"
											}
											src={mediaUrl} // Assuming mediaUrl is the complete Firebase Storage URL
											alt="post media"
											onClick={() => openPhotoViewer(mediaUrl)}
										/>
									)}
								</div>
							))}
						</div>
					)}
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
		</>
	);
};

export default PostComment;
