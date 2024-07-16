import React, { useEffect, useState } from "react";
import "./Comments.css";
import { Link } from "react-router-dom";
import { format } from "timeago.js";
import { useGetCommentsQuery } from "../../features/homes/commentApiSlice";
import { useGetUsersQuery } from "../../features/profile/usersApiSlice";

const IMG_URL = import.meta.env.VITE_PUBLIC_FOLDER;

const Comments = ({ commentId, scrollToPictures, openPhotoViewer }) => {
	const { comment, isLoading, error } = useGetCommentsQuery("commentsList", {
		selectFromResult: ({ data }) => ({
			comment: data?.entities[commentId],
		}),
	});

	const { user } = useGetUsersQuery("usersList", {
		selectFromResult: ({ data }) => ({
			user: data?.entities[comment?.user],
		}),
	});

	if (isLoading) {
		return <div>Loading comment...</div>;
	}

	if (error) {
		return <div>Error: {error.message}</div>;
	}

	console.log(comment);

	return (
		<div className="comment_colunm">
			<div className="comment_flex">
				<div className="comment_items">
					<Link to={`/home/${user?._id}`} onClick={scrollToPictures}>
						<img
							src={
								user?.profilePicture
									? IMG_URL + user?.profilePicture
									: IMG_URL + "avatar2.png"
							}
							alt="Profile"
							className="comment_img"
						/>
					</Link>
					<span className="comment_name">{user?.username}</span>
				</div>
				<span className="comment_date">{format(comment?.createdAt)}</span>
			</div>
			{comment?.desc && <p className="comment_text">{comment?.desc}</p>}
			{!comment?.commentImage?.length ? null : (
				<div
					className={
						comment?.commentImage?.length === 2
							? "comment_img_container_double"
							: comment?.commentImage?.length === 3
							? "comment_img_container_trepple"
							: comment?.commentImage?.length === 4
							? "comment_img_container_four"
							: comment?.commentImage?.length > 4
							? "comment_img_container_multiple"
							: "comment_img_container_single"
					}
				>
					{comment?.commentImage?.map((mediaUrl) => (
						<div key={mediaUrl} className="comment_Media">
							{/* Check if the media is an comment or video */}
							{mediaUrl?.endsWith(".mp4") ? (
								<video controls className="comment_Video">
									<source src={mediaUrl} type="video/mp4" />
									Your browser does not support the video tag.
								</video>
							) : (
								<img
									className={
										comment?.commentImage?.length === 2
											? "comment_img_double"
											: comment?.commentImage?.length === 3
											? "comment_img_trepple"
											: comment?.commentImage?.length === 4
											? "comment_img_four"
											: comment?.commentImage?.length > 4
											? "comment_img_multiple"
											: "comment_image"
									}
									src={mediaUrl} // Assuming mediaUrl is the complete Firebase Storage URL
									alt="comment media"
									onClick={() => openPhotoViewer(mediaUrl)}
								/>
							)}
						</div>
					))}
				</div>
			)}
		</div>
	);
};

export default Comments;
