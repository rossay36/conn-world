import React from "react";
import { BiSolidLike } from "react-icons/bi";
import { GiSelfLove } from "react-icons/gi";
import LikeDropdown from "../post/LikeDropdown";
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";

const PostLikes = ({
	like,
	likeHandler,
	isLiked,
	likers,
	toggleLikersVisible,
	likersVisible,
	scrollToPictures,
}) => {
	return (
		<div className="postBottomLeft">
			<BiSolidLike
				className="likeIcon"
				style={isLiked ? { color: "blue" } : null}
				onClick={likeHandler}
			/>

			<GiSelfLove
				className="likeIcon"
				style={isLiked ? { color: "red" } : null}
				onClick={likeHandler}
			/>

			{likersVisible && (
				<div className="likersDropdown">
					<ul className="likersDropdown_item">
						<p className="likersDropdown_title">
							{!likers?.length
								? "no Likes"
								: likers?.length === 1
								? `${likers?.length} person Like your post`
								: `${likers?.length} people Like your post`}
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
				{like} {like === 1 ? "like " : "likes "}
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
