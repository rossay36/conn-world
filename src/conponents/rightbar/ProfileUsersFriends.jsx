import React, { useEffect, useState } from "react";
import { useGetUsersQuery } from "../../features/profile/usersApiSlice";
import { Link } from "react-router-dom";
import { useGetPostsQuery } from "../../features/homes/postsApiSlice";
const IMG_URL = import.meta.env.VITE_PUBLIC_FOLDER;
import { getStorage, ref, getMetadata } from "firebase/storage";

const fetchMediaType = async (url) => {
	const storage = getStorage();
	const storageRef = ref(storage, url);
	try {
		const metadata = await getMetadata(storageRef);
		return metadata.contentType; // Returns MIME type, e.g., 'video/mp4' or 'image/jpeg'
	} catch (error) {
		console.error("Error fetching metadata:", error);
		return null;
	}
};

const ProfileUsersFriends = ({
	postIds,
	scrollToPictures,
	openPhotoViewer,
}) => {
	const {
		currentUserPosts,
		isLoading: currentUserLoading,
		isError: currentUserError,
		refetch: refetchCurrentUser,
	} = useGetPostsQuery("usersList", {
		selectFromResult: ({ data }) => ({
			currentUserPosts: data?.entities[postIds],
		}),
	});

	const [mediaType, setMediaType] = useState(null);
	const [mediaUrl, setMediaUrl] = useState(null);
	const [isMuted, setIsMuted] = useState(true); // Default to muted

	useEffect(() => {
		const fetchAndSetMediaType = async () => {
			if (currentUserPosts?.image) {
				const url = currentUserPosts.image;
				const type = await fetchMediaType(url);
				setMediaType(type);
				setMediaUrl(url); // Ensure the media URL is set
			}
		};
		fetchAndSetMediaType();
	}, [currentUserPosts?.image]);

	const toggleMute = () => {
		setIsMuted(!isMuted);
	};

	return (
		<>
			<div className="rightbarFollowings">
				<div className="rightbarFollowing">
					{currentUserLoading ? (
						<p>Loading...</p>
					) : currentUserError ? (
						<p className="errmsg">Error: {currentUserError.message}</p>
					) : mediaType?.startsWith("video/") ? (
						<video
							controls
							autoPlay
							loop
							muted={isMuted}
							className="rightbarFollowingImg"
							src={mediaUrl}
							type={mediaType}
							onClick={toggleMute}
						>
							Your browser does not support the video tag.
						</video>
					) : (
						<img
							className="rightbarFollowingImg"
							src={
								currentUserPosts?.image
									? currentUserPosts?.image
									: IMG_URL + "/avatar2.png"
							}
							alt=""
							onClick={() =>
								openPhotoViewer(
									currentUserPosts?.image
										? currentUserPosts?.image
										: IMG_URL + "/avatar2.png"
								)
							}
						/>
					)}
				</div>
			</div>
		</>
	);
};

export default ProfileUsersFriends;
