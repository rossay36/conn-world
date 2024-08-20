import React, { useState, useEffect } from "react";
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";
import { GiSelfLove } from "react-icons/gi";
import LikeDropdown from "../post/LikeDropdown";

import useAuth from "../../hooks/useAuth";
import {
	useLikePostMutation,
	useUnlikePostMutation,
} from "../../features/homes/postsApiSlice";

const PostLikes = ({ postId, post, scrollToPictures }) => {
	const { userId } = useAuth();
	const [likeCount, setLikeCount] = useState(post?.likes?.length || 0);
	const [isLiked, setIsLiked] = useState(
		post?.likes?.includes(userId) || false
	);
	const [likers, setLikers] = useState(post?.likes || []);
	const [likersVisible, setLikersVisible] = useState(false);

	const [likePost] = useLikePostMutation();
	const [unlikePost] = useUnlikePostMutation();

	useEffect(() => {
		if (post) {
			setLikeCount(post.likes.length);
			setIsLiked(post.likes.includes(userId));
			setLikers(post.likes);
		}
	}, [post, postId, userId]);

	const handleLike = async () => {
		try {
			if (isLiked) {
				await unlikePost(post?._id).unwrap();
				setLikeCount((prev) => prev - 1);
				setLikers((prev) => prev.filter((id) => id !== userId));
			} else {
				await likePost(post?._id).unwrap();
				setLikeCount((prev) => prev + 1);
				setLikers((prev) => [...prev, userId]);
			}
			setIsLiked((prev) => !prev);
		} catch (error) {
			console.error("Error handling like:", error);
		}
	};

	const toggleLikersVisible = () => {
		setLikersVisible((prev) => !prev);
	};

	return (
		<div className="postBottomLeft">
			<GiSelfLove
				className="likeIcon"
				style={isLiked ? { color: "red" } : null}
				onClick={handleLike}
			/>

			{likersVisible && (
				<div className="likersDropdown">
					<ul className="likersDropdown_item">
						<p className="likersDropdown_title">
							{!likers.length
								? "no Likes"
								: likers.length === 1
								? `${likers.length} person liked your post`
								: `${likers.length} people liked your post`}
						</p>
						{likers.map((likerId) => (
							<LikeDropdown
								key={likerId}
								likerId={likerId}
								scrollToPictures={scrollToPictures}
							/>
						))}
					</ul>
				</div>
			)}

			<span className="postLikeCounter" onClick={toggleLikersVisible}>
				{likeCount}
				{likersVisible ? (
					<IoMdArrowDropup className="postLikeCounter_icons" />
				) : (
					<IoMdArrowDropdown className="postLikeCounter_icons" />
				)}
			</span>
		</div>
	);
};

export default PostLikes;
