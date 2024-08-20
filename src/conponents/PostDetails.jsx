import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { MdMoreVert } from "react-icons/md";
import { format } from "timeago.js";
import MediaImageAndVideoController from "./mediaImageAndVideoController/MediaImageAndVideoController";

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
									? post?.profilePicture
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
				<header className="postText_container">
					<Link to={`/home/post/${post?._id}`}>
						<p className="postText">{post?.text}</p>
					</Link>
				</header>
				<div className="postMediaContainer">
					<MediaImageAndVideoController
						mediaUrls={post?.image}
						onClick={openPhotoViewer}
					/>
				</div>
			</div>
		</>
	);
};

export default PostDetails;
