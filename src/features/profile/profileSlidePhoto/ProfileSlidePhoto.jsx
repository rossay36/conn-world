import React from "react";
import { useGetPostsQuery } from "../../homes/postsApiSlice";
import useAuth from "../../../hooks/useAuth";
import { useParams } from "react-router-dom";
import "./ProfileSlidePhoto.css";
import { useGetUsersQuery } from "../usersApiSlice";
import { format } from "timeago.js";

const IMG_URL = import.meta.env.VITE_PUBLIC_FOLDER;

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

	const { users } = useGetUsersQuery("usersList", {
		selectFromResult: ({ data }) => ({
			users: data?.entities[myId],
		}),
	});

	if (isLoading || !post) {
		return <div>Loading...</div>;
	}

	const imagesToRender = post?.image
		? Array.isArray(post.image)
			? post.image
			: [post.image]
		: [];

	const renderContent = () => {
		// Check if post contains both text and images
		const hasText = post.text && post.text.trim().length > 0;
		const hasImages =
			post.image && (Array.isArray(post.image) ? post.image.length > 0 : true);

		if (hasText && hasImages) {
			return (
				<div className="ProfileSlidePhoto">
					<p className="PostText">{post.text}</p>
					<div className="PostImages">
						{post.image.map((imageUrl, index) => (
							<img
								key={index}
								ref={profileSectionRef}
								className="ProfileSlidePhoto_image"
								src={imageUrl ? imageUrl : IMG_URL + "avatar3.png"}
								alt={`Image ${index + 1}`}
								onClick={() =>
									openPhotoViewer(imageUrl ? imageUrl : IMG_URL + "avatar3.png")
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
						{post.image.map((imageUrl, index) => (
							<img
								key={index}
								ref={profileSectionRef}
								className="ProfileSlidePhoto_image"
								src={imageUrl ? imageUrl : IMG_URL + "avatar3.png"}
								alt={`Image ${index + 1}`}
								onClick={() =>
									openPhotoViewer(imageUrl ? imageUrl : IMG_URL + "avatar3.png")
								}
							/>
						))}
					</div>
					<p className="profileSlide_time">{format(post?.createdAt)}</p>
				</div>
			);
		} else {
			// Render only text if no images
			return (
				<div className="ProfileSlidePhoto">
					<div className="ProfileSlide_text">
						<p className="PostText_only">{post.text}</p>
					</div>
					<p className="profileSlide_time">{format(post?.createdAt)}</p>
				</div>
			);
		}
	};

	return renderContent();
};

export default ProfileSlidePhoto;
