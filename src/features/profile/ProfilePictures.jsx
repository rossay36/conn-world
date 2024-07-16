import React, { useState, useEffect, useRef } from "react";
import { Carousel } from "antd";
import { useGetPostsQuery } from "../homes/postsApiSlice";
import ProfileSlidePhoto from "./profileSlidePhoto/ProfileSlidePhoto";
import useAuth from "../../hooks/useAuth";
import { useParams } from "react-router-dom";
import { useGetUsersQuery } from "./usersApiSlice";
import { useUpdateActiveSlideMutation } from "./usersApiSlice";
import { GrPowerReset } from "react-icons/gr";

import {
	SlArrowLeft,
	SlArrowRight,
	SlArrowUp,
	SlArrowDown,
} from "react-icons/sl";
import { RingLoader } from "react-spinners";

const IMG_URL = import.meta.env.VITE_PUBLIC_FOLDER;

const ProfilePictures = ({ profileSectionRef, user, openPhotoViewer }) => {
	const [updateActiveSlide, { isLoading: loading }] =
		useUpdateActiveSlideMutation();
	const { userId } = useAuth();
	const { userId: paramId } = useParams();

	const { users, isLoading, error } = useGetUsersQuery("postsList", {
		selectFromResult: ({ data }) => ({
			users: data?.entities[userId],
		}),
	});

	const carouselRef = useRef(null); // Ref for controlling Carousel

	const {
		data: posts,
		isLoading: postsLoading,
		isError: postsError,
		isSuccess: postsSuccess,
		error: postsErrorData,
		refetch: refetchPosts,
	} = useGetPostsQuery("postsList", {
		pollingInterval: 15000,
		refetchOnFocus: true,
		refetchOnMountOrArgChange: true,
	});

	// Fetch posts when paramId changes (i.e., when visiting different profiles)
	useEffect(() => {
		refetchPosts();
	}, [paramId, refetchPosts]);

	const handleSlides = () => {
		updateActiveSlide({ userId, isActiveSlide: !user?.isActiveSlide });
	};

	const nextSlide = () => {
		carouselRef.current.next();
	};

	const prevSlide = () => {
		carouselRef.current.prev();
	};

	const resetSlide = () => {
		carouselRef.current.goTo(0);
	};

	let content;

	if (postsLoading || loading) {
		content = (
			<div>
				loading <RingLoader size={20} margin="auto" color="#000" />
			</div>
		);
	}

	if (postsError) {
		content = <div>Error: {postsErrorData?.message}</div>;
	}

	if (postsSuccess) {
		const { ids } = posts;
		// Filter the ids based on the condition user?._id === post?.user
		const filteredIds = ids.filter((postId) => {
			const post = posts?.entities?.[postId];
			if (!post || !post.user) {
				return false; // Skip if post or post.user is undefined
			}
			return user?._id === post.user;
		});
		content = filteredIds?.map((postId) => (
			<ProfileSlidePhoto
				key={postId}
				postId={postId}
				openPhotoViewer={openPhotoViewer}
				profileSectionRef={profileSectionRef}
				user={user}
				handleSlides={handleSlides}
				isActiveSlide={user?.isActiveSlide}
			/>
		));
	}

	return (
		<div className="profileRightTop">
			<div className="profileCover">
				{userId === paramId && (
					<button className="profile_botton" onClick={handleSlides}>
						{user?.isActiveSlide ? (
							<div>
								{loading ? (
									<RingLoader size={20} margin="auto" color="#fff" />
								) : (
									<SlArrowUp title="hide slide pictures" />
								)}
							</div>
						) : (
							<div>
								{loading ? (
									<RingLoader size={20} margin="auto" color="#fff" />
								) : (
									<SlArrowDown title="show slide pitcures" />
								)}
							</div>
						)}
					</button>
				)}
				{user?.isActiveSlide && (
					<div className="ProfilePictures_bottons_control">
						<button
							className="ProfilePictures_control_buttonA"
							onClick={prevSlide}
						>
							<SlArrowLeft />
						</button>

						<button
							className="ProfilePictures_control_buttonC"
							onClick={resetSlide}
						>
							<GrPowerReset />
						</button>
						<button
							className="ProfilePictures_control_buttonB"
							onClick={nextSlide}
						>
							<SlArrowRight />
						</button>
					</div>
				)}
				{paramId && (
					<>
						{user?.isActiveSlide ? (
							<Carousel
								autoplay
								pauseOnHover
								pauseOnFocus
								dots={false}
								ref={carouselRef}
							>
								{content}
							</Carousel>
						) : (
							<img
								ref={profileSectionRef}
								className="profileCoverImg"
								src={
									user?.coverPicture
										? IMG_URL + user?.coverPicture
										: IMG_URL + "avatar3.png"
								}
								alt=""
								onClick={() =>
									openPhotoViewer(
										user?.coverPicture
											? IMG_URL + user?.coverPicture
											: IMG_URL + "avatar3.png"
									)
								}
							/>
						)}
					</>
				)}
				<img
					className="profileUserImg"
					src={
						user?.profilePicture
							? IMG_URL + user?.profilePicture
							: IMG_URL + "avatar2.png"
					}
					alt=""
					onClick={() =>
						openPhotoViewer(
							user?.profilePicture
								? IMG_URL + user?.profilePicture
								: IMG_URL + "avatar2.png"
						)
					}
				/>
			</div>
			<div className="profile_detials">
				<div className="profileInfo">
					<h4 className="profileInfoName">Hobbies</h4>
					{user?.hobbies?.map((hob) => (
						<span className="profileInfoDesc" key={hob}>
							{hob}
						</span>
					))}
				</div>
				<div className="profileInfo">
					<h4 className="profileInfoName info_name">{user?.username}</h4>
					<div className="rightbarInfoItem">
						<span className="profileInfoDesc_key">Bio:</span>
						<span className="profileInfoDesc_value">{user?.bio}</span>
					</div>
					<div className="rightbarInfoItem">
						<span className="profileInfoDesc_key">Relationship:</span>
						<span className="profileInfoDesc_value">{user?.relationship}</span>
					</div>
					<div className="rightbarInfoItem">
						<span className="profileInfoDesc_key">Job:</span>
						<span className="profileInfoDesc_value">{user?.job}</span>
					</div>
					<div className="rightbarInfoItem">
						<span className="profileInfoDesc_key">Working:</span>
						<span className="profileInfoDesc_value">{user?.workAt}</span>
					</div>
				</div>
				<div className="profileInfo">
					<h4 className="profileInfoName">Education</h4>
					<div className="profile_edu">
						<span className="profileInfoDesc_key">University: </span>
						<span className="profileInfoDesc_value">
							{user?.education?.university}
						</span>
					</div>
					<div className="profile_edu">
						<span className="profileInfoDesc_key">Colloege: </span>
						<span className="profileInfoDesc_value">
							{user?.education?.college}
						</span>
					</div>
					<div className="profile_edu">
						<span className="profileInfoDesc_key">Degree: </span>
						<span className="profileInfoDesc_value">
							{user?.education?.degree}
						</span>
					</div>
					<div className="profile_edu">
						<span className="profileInfoDesc_key">Courses: </span>
						<span className="profileInfoDesc_value">
							{user?.education?.fieldOfStudy}
						</span>
					</div>
					<div className="profile_edu">
						<span className="profileInfoDesc_key">Start Year: </span>
						<span className="profileInfoDesc_value">
							{user?.education?.startYear}
						</span>
					</div>
					<div className="profile_edu">
						<span className="profileInfoDesc_key">End Year: </span>
						<span className="profileInfoDesc_value">
							{user?.education?.endYear}
						</span>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ProfilePictures;
