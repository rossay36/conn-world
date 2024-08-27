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
import EditProfilePicture from "./EditProfilePicture";
import EditCoverPicture from "./EditCoverPicture";

// const IMG_URL = import.meta.env.VITE_PUBLIC_FOLDER;

const ProfilePictures = ({ profileSectionRef, user, openPhotoViewer }) => {
	const [updateActiveSlide, { isLoading: loading }] =
		useUpdateActiveSlideMutation();
	const { userId } = useAuth();
	const { userId: paramId } = useParams();
	const [isEduOpen, setIsEduOpen] = useState(false);

	const { users, isLoading, error } = useGetUsersQuery("usersList", {
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

	const sex =
		user?.gender === "Male" ? "His" : user?.gender === "Female" ? "Her" : null;

	const handleEducation = () => {
		setIsEduOpen((prev) => !prev);
	};

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
							<>
								<img
									ref={profileSectionRef}
									className="profileCoverImg"
									src={
										user?.coverPicture
											? user?.coverPicture
											: "/images/avatar2.png"
									}
									alt=""
									onClick={() =>
										openPhotoViewer(
											user?.coverPicture
												? user?.coverPicture
												: "/images/avatar2.png"
										)
									}
								/>
								<div className="cover_edit_Container">
									<EditCoverPicture />
								</div>
							</>
						)}
					</>
				)}

				<div className="profile_image_container">
					<img
						className={
							userId !== paramId ? "profileUserImg_friend" : "profileUserImg"
						}
						src={
							user?.profilePicture
								? user?.profilePicture
								: "/images/avatar2.png"
						}
						alt=""
						onClick={() =>
							openPhotoViewer(
								user?.profilePicture
									? user?.profilePicture
									: "/images/avatar2.png"
							)
						}
					/>

					<div className="EditProfilePicture_container">
						<EditProfilePicture />
					</div>
				</div>
			</div>
			<div className="profile_bio_username">
				<h4
					className={
						userId !== paramId ? "profileInfoName_friend" : "profileInfoName"
					}
				>{`${user?.firstname} ${user?.lastname}`}</h4>
				<div className="rightbarInfoItem_bio">
					<span className="profileInfoDesc_key">Bio:</span>
					<span className="profileInfoDesc_value">{user?.bio}</span>
				</div>
			</div>
			<hr className="profile_bio_username_hr"></hr>
			<button className="profile_personal_infos" onClick={handleEducation}>
				{user?.username}: Informations
			</button>
			<hr className="profile_bio_username_hr"></hr>
			<div className="profile_detials">
				{isEduOpen && (
					<div className="profile_user_container">
						<div className="profileInfo">
							<header className="profileInfoName">Contacts</header>
							{user?.contacts?.emailAdress?.length > 0 ? (
								user?.contacts?.emailAdress?.map((con) => (
									<span className="profileInfoDesc" key={con}>
										{`email: ${con}`}
									</span>
								))
							) : (
								<span className="profileInfoDesc">
									{user?._id === paramId
										? `${user?.username} Update Your Contact`
										: `${user?.username} Has Not Updated ${sex} Contact`}
								</span>
							)}
						</div>
						<div className="profileInfo">
							<header className="profileInfoName">
								Lives In, Status & Job
							</header>
							<div className="rightbarInfoItem">
								<span className="profileInfoDesc_key">Relationship:</span>
								<span className="profileInfoDesc_value">
									{user?.relationship}
								</span>
							</div>
							<div className="rightbarInfoItem">
								<span className="profileInfoDesc_key">Country:</span>
								<span className="profileInfoDesc_value">
									{user?.lives?.currentCountry}
								</span>
							</div>
							<div className="rightbarInfoItem">
								<span className="profileInfoDesc_key">State:</span>
								<span className="profileInfoDesc_value">
									{user?.lives?.currentState}
								</span>
							</div>
							<div className="rightbarInfoItem">
								<span className="profileInfoDesc_key">City:</span>
								<span className="profileInfoDesc_value">
									{user?.lives?.currentCity}
								</span>
							</div>
							<div className="rightbarInfoItem">
								<span className="profileInfoDesc_key">Street:</span>
								<span className="profileInfoDesc_value">
									{user?.lives?.currentStreet}
								</span>
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
							<header className="profileInfoName">Education</header>
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
						<div className="profileInfo">
							<header className="profileInfoName">Address</header>
							<div className="profile_edu">
								<div className="profile_edu">
									<span className="profileInfoDesc_key">Country: </span>
									<span className="profileInfoDesc_value">
										{user?.address?.country}
									</span>
								</div>
								<div className="profile_edu">
									<span className="profileInfoDesc_key">State: </span>
									<span className="profileInfoDesc_value">
										{user?.address?.state}
									</span>
								</div>
								<div className="profile_edu">
									<span className="profileInfoDesc_key">City: </span>
									<span className="profileInfoDesc_value">
										{user?.address?.city}
									</span>
								</div>
								<div className="profile_edu">
									<span className="profileInfoDesc_key">Street: </span>
									<span className="profileInfoDesc_value">
										{user?.address?.street}
									</span>
								</div>
								<div className="profile_edu">
									<span className="profileInfoDesc_key">Postal Code: </span>
									<span className="profileInfoDesc_value">
										{user?.address?.postalCode}
									</span>
								</div>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default ProfilePictures;
