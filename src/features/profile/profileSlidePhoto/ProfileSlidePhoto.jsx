import React from "react";
import { useGetPostsQuery } from "../../homes/postsApiSlice";
import useAuth from "../../../hooks/useAuth";
import { useParams } from "react-router-dom";
import "./ProfileSlidePhoto.css";
import { useGetUsersQuery } from "../usersApiSlice";
import { format } from "timeago.js";

// const IMG_URL = import.meta.env.VITE_PUBLIC_FOLDER;

// Helper function to check if a URL points to an image
const isImageUrl = (url) => {
	console.log(`Checking URL: ${url}`);
	// Using URL object to parse the URL
	try {
		const parsedUrl = new URL(url);
		const path = parsedUrl.pathname.toLowerCase();
		// Check if the path ends with a known image file extension
		return /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(path);
	} catch (error) {
		console.error("Invalid URL:", url);
		return false;
	}
};

const ProfileSlidePhoto = ({
	postId,
	openPhotoViewer,
	profileSectionRef,
	isActiveSlide,
	handleSlides,
	user,
}) => {
	const { userId: myId } = useAuth();
	const { userId } = useParams();

	const { post, isLoading, error } = useGetPostsQuery("postsList", {
		selectFromResult: ({ data }) => ({
			post: data?.entities[postId],
		}),
	});

	if (isLoading || !post) {
		return <div>Loading...</div>;
	}

	// Extract and filter image URLs
	const allImageUrls = Array.isArray(post.image) ? post.image : [post.image];

	console.log("All Image URLs:", allImageUrls);

	const imagesToRender = allImageUrls.filter((url) => isImageUrl(url));

	console.log("Filtered Images:", imagesToRender);
	const renderContent = () => {
		const hasText = post.text?.trim().length > 0;
		const hasImages = imagesToRender.length > 0;

		if (hasText && hasImages) {
			return (
				<div className="ProfileSlidePhoto">
					<p className="PostText">{post.text}</p>
					<div className="PostImages">
						{imagesToRender.map((imageUrl, index) => (
							<img
								key={index}
								ref={profileSectionRef}
								className="ProfileSlidePhoto_image"
								src={imageUrl || `${IMG_URL}/images/avatar3.png`}
								alt={`Image ${index + 1}`}
								onClick={() =>
									openPhotoViewer(imageUrl || `${IMG_URL}/images/avatar3.png`)
								}
							/>
						))}
					</div>
					<p className="profileSlide_time">{format(post?.createdAt)}</p>
				</div>
			);
		} else if (hasImages) {
			// Render only images if text is empty
			return (
				<div className="ProfileSlidePhoto">
					<div className="PostImages">
						{imagesToRender.map((imageUrl, index) => (
							<img
								key={index}
								ref={profileSectionRef}
								className="ProfileSlidePhoto_image"
								src={imageUrl || `${IMG_URL}/images/avatar3.png`}
								alt={`Image ${index + 1}`}
								onClick={() =>
									openPhotoViewer(imageUrl || `${IMG_URL}/images/avatar3.png`)
								}
							/>
						))}
					</div>
					<p className="profileSlide_time">{format(post?.createdAt)}</p>
				</div>
			);
		} else if (hasText) {
			// Render only text if no images
			return (
				<div className="ProfileSlidePhoto">
					<div className="ProfileSlide_text">
						<p className="PostText_only">{post.text}</p>
					</div>
					<p className="profileSlide_time">{format(post?.createdAt)}</p>
				</div>
			);
		} else {
			// Render a fallback if neither text nor images are available
			return <div>No content available.</div>;
		}
	};

	return renderContent();
};

export default ProfileSlidePhoto;
