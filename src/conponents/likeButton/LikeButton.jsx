// LikeButton.js
import React, { useState, useEffect } from "react";
import {
	useLikePostMutation,
	useUnlikePostMutation,
} from "../../features/homes/postsApiSlice";

const LikeButton = ({ postId, userId, initialLikes }) => {
	const [likeCount, setLikeCount] = useState(initialLikes || 0);
	const [isLiked, setIsLiked] = useState(false);

	const [likePost] = useLikePostMutation();
	const [unlikePost] = useUnlikePostMutation();

	useEffect(() => {
		const checkIfLiked = async () => {
			try {
				const post = await fetchPost(postId); // Assume fetchPost fetches the post data
				setIsLiked(post.likes.includes(userId));
				setLikeCount(post.likes.length);
			} catch (error) {
				console.error("Error fetching post data:", error);
			}
		};

		checkIfLiked();
	}, [postId, userId]);

	const handleLike = async () => {
		try {
			if (isLiked) {
				await unlikePost(postId).unwrap();
				setLikeCount((prev) => prev - 1);
			} else {
				await likePost(postId).unwrap();
				setLikeCount((prev) => prev + 1);
			}
			setIsLiked((prev) => !prev);
		} catch (error) {
			console.error("Error handling like:", error);
		}
	};

	return (
		<button onClick={handleLike}>
			{isLiked ? "Unlike" : "Like"} ({likeCount})
		</button>
	);
};

// Mock function to fetch post data
const fetchPost = async (postId) => {
	// Replace with actual implementation to fetch post data
	return {
		likes: [], // Mock data, replace with real data
	};
};

export default LikeButton;
