import React from "react";
import { Link } from "react-router-dom";
import { MdMoreVert } from "react-icons/md";
import { format } from "timeago.js";

const IMG_URL = import.meta.env.VITE_PUBLIC_FOLDER;

const PostDetails = ({ scrollToPictures, post, openPhotoViewer }) => {
	return (
		<>
			<div className="postTop">
				<div className="postTopLeft">
					<Link to={`/home/${post?.user}`} onClick={scrollToPictures}>
						<img
							className="postProfileImg"
							src={
								post?.profilePicture
									? IMG_URL + post?.profilePicture
									: IMG_URL + "/avatar2.png"
							}
							alt=""
						/>
					</Link>
					<span className="postUsername">{post?.username}</span>
					<span className="postDate">{format(post?.createdAt)}</span>
				</div>
				<div className="postTopRight">
					<MdMoreVert />
				</div>
			</div>
			<div className="postCenter">
				<p className="postText">{post?.text}</p>
				<div className="postMediaContainer">
					{post?.image?.map((mediaUrl) => (
						<div key={mediaUrl} className="postMedia">
							{/* Check if the media is an image or video */}
							{mediaUrl?.endsWith(".mp4") ? (
								<video controls className="postVideo">
									<source src={mediaUrl} type="video/mp4" />
									Your browser does not support the video tag.
								</video>
							) : (
								<img
									className={
										post?.image?.length === 2
											? "post_img_double"
											: post?.image?.length > 2
											? "post_img_multiple"
											: "postImg"
									}
									src={mediaUrl} // Assuming mediaUrl is the complete Firebase Storage URL
									alt="post media"
									onClick={() => openPhotoViewer(mediaUrl)}
								/>
							)}
						</div>
					))}
				</div>
			</div>
		</>
	);
};

export default PostDetails;
