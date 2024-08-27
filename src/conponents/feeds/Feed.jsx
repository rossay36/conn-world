import React, { useState, useEffect, useRef } from "react";
import Post from "../post/Post";
import { useGetPostsQuery } from "../../features/homes/postsApiSlice";
import useAuth from "../../hooks/useAuth";
import "./feed.css";
import ClipLoader from "react-spinners/ClipLoader";
import ProfilePost from "../post/ProfilePost";
import { useGetUsersQuery } from "../../features/profile/usersApiSlice";
import { useParams } from "react-router-dom";
import EmptyOrErroCOmponent from "../emptyOrErroCOmponent/EmptyOrErroCOmponent";
import { FaFrownOpen } from "react-icons/fa";

const Feed = ({ scrollToPictures, profilePostId }) => {
	const { userId } = useAuth();
	const feedRef = useRef(null);
	const { userId: friendId } = useParams();

	const {
		data: post,
		isLoading: postsLoading,
		isError: postsError,
		isSuccess: postsSuccess,
		error: postsErrorData,
	} = useGetPostsQuery("postsList", {
		pollingInterval: 5000,
		refetchOnFocus: true,
		refetchOnMountOrArgChange: true,
	});

	const { user } = useGetUsersQuery("usersList", {
		selectFromResult: ({ data }) => ({
			user: data?.entities[friendId],
		}),
	});

	console.log(user?.posts);

	const [isShareVisible, setIsShareVisible] = useState(true);
	const [lastScrollTop, setLastScrollTop] = useState(0);

	useEffect(() => {
		const handleScroll = () => {
			const currentScrollTop = feedRef.current?.scrollTop;

			if (currentScrollTop > lastScrollTop && currentScrollTop > 50) {
				setIsShareVisible(false); // Scroll down, hide Share component
			} else {
				setIsShareVisible(true); // Scroll up or near top, show Share component
			}

			setLastScrollTop(currentScrollTop <= 0 ? 0 : currentScrollTop);
		};

		feedRef?.current?.addEventListener("scroll", handleScroll);

		return () => {
			feedRef?.current?.removeEventListener("scroll", handleScroll);
		};
	}, [lastScrollTop]);

	let content;

	if (postsLoading)
		content = (
			<p
				style={{
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
				}}
			>
				<ClipLoader color="#FFF" />
			</p>
		);

	if (postsError) {
		content = <p className="errmsg">{postsErrorData?.data?.message}</p>;
	}

	if (postsSuccess) {
		const { ids } = post || {};

		const postContent = profilePostId ? (
			user?.posts?.length ? (
				user?.posts.map((postId) => (
					<ProfilePost
						key={postId}
						postId={postId}
						scrollToPictures={scrollToPictures}
						profilePostId={profilePostId}
						isOpen={postId === profilePostId}
					/>
				))
			) : (
				<EmptyOrErroCOmponent title={"No Post Found!"} icon={<FaFrownOpen />} />
			)
		) : (
			ids?.map((postId) => (
				<Post
					key={postId}
					postId={postId}
					scrollToPictures={scrollToPictures}
					profilePostId={profilePostId}
					isOpen={postId === profilePostId}
				/>
			))
		);

		content = (
			<div className="feed" ref={feedRef}>
				{postContent}
			</div>
		);
	}

	if (!post?.ids?.length) {
		content = (
			<>
				{postsError && (
					<EmptyOrErroCOmponent
						title={"No Post To Display"}
						desc={"Check your network connection"}
						icons={<ClipLoader color="#fff" />}
					/>
				)}
			</>
		);
	}

	return content;
};

export default Feed;
