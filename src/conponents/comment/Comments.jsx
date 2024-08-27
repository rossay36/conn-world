import "./Comments.css";
import { Link } from "react-router-dom";
import { format } from "timeago.js";
import { useGetCommentsQuery } from "../../features/homes/commentApiSlice";
import { useGetUsersQuery } from "../../features/profile/usersApiSlice";
import { useEffect } from "react";
import { GiSelfLove } from "react-icons/gi";
import { MdOutlineComment } from "react-icons/md";
import { BiRepost } from "react-icons/bi";
import { CiViewBoard } from "react-icons/ci";
import { FaRegShareFromSquare } from "react-icons/fa6";
import { GrTag } from "react-icons/gr";
import MediaImageAndVideoController from "../mediaImageAndVideoController/MediaImageAndVideoController";

// const IMG_URL = import.meta.env.VITE_PUBLIC_FOLDER;

const Comments = ({ commentId, scrollToPictures, openPhotoViewer }) => {
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
									: "/images/avatar2.png"
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
