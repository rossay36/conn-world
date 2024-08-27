import React, { useState, useEffect, useRef } from "react";
import Post from "../post/Post";
import { useGetPostsQuery } from "../../features/homes/postsApiSlice";
import useAuth from "../../hooks/useAuth";
import "./feed.css";
import ClipLoader from "react-spinners/ClipLoader";
import ProfilePost from "../post/ProfilePost";
import { useGetUsersQuery } from "../../features/profile/usersApiSlice";

const Feed = ({ scrollToPictures, profilePostId }) => {
	const { userId } = useAuth();
	const feedRef = useRef(null);

	const {
		data: posts,
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
			user: data?.entities[userId],
		}),
	});

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
		const { ids } = posts || {};

		const postContent = profilePostId ? (
			ids?.length ? (
				ids?.map((postId) => (
					<ProfilePost
						key={postId}
						postId={postId}
						scrollToPictures={scrollToPictures}
						profilePostId={profilePostId}
						isOpen={postId === profilePostId}
					/>
				))
			) : (
				<p style={{ color: "#fff" }}>"No Post To Display"</p>
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

	if (!posts?.ids?.length) {
		content = (
			<div
				style={{
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					flexDirection: "column",
					gap: "1rem",
				}}
			>
				<h3>No Post To Display</h3>
				<div
					style={{
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						gap: "1rem",
						color: "GrayText",
					}}
				>
					<p>Check your network connection or reload... </p>
					<ClipLoader color="#fff" />
				</div>
			</div>
		);
	}

	return content;
};

export default Feed;
