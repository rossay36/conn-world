import React, { useEffect, useState } from "react";
import { getStorage, ref, getMetadata } from "firebase/storage";
import { openMediaViewer, selectMedia } from "../../features/auth/mediaSlice";
import { useDispatch, useSelector } from "react-redux";
import PhotoAndVideoeViewer from "../../features/auth/PhotoAndVideoeViewer";

const IMG_URL = import.meta.env.VITE_PUBLIC_FOLDER;

const ProfileUsersFriends = ({ currentUser }) => {
	const [mediaTypes, setMediaTypes] = useState({});
	const [isMuted, setIsMuted] = useState(true); // Default to muted
	const dispatch = useDispatch();
	const { mediaUrl, mediaType, isOpen } = useSelector(selectMedia);

	useEffect(() => {
		const fetchMediaTypes = async () => {
			const validMediaUrls = currentUser?.media
				?.map((mediaItem) => mediaItem.url)
				.filter((url) => url); // Extract URLs

			const mediaTypePromises = validMediaUrls.map(async (mediaUrl) => {
				const storage = getStorage();
				const storageRef = ref(storage, mediaUrl);
				try {
					const metadata = await getMetadata(storageRef);
					return { url: mediaUrl, type: metadata.contentType };
				} catch (error) {
					console.error("Error fetching metadata:", error);
					return { url: mediaUrl, type: null };
				}
			});

			try {
				const mediaTypeResults = await Promise.all(mediaTypePromises);
				const mediaTypesMap = mediaTypeResults.reduce((acc, { url, type }) => {
					if (url && type) acc[url] = type;
					return acc;
				}, {});
				setMediaTypes(mediaTypesMap);
			} catch (error) {
				console.error("Error processing media types:", error);
			}
		};

		if (currentUser?.media) {
			fetchMediaTypes();
		}
	}, [currentUser]);

	const toggleMute = () => {
		setIsMuted(!isMuted);
	};

	const handleMediaClick = (mediaUrl) => {
		const type = mediaTypes[mediaUrl]?.startsWith("video/") ? "video" : "image";
		dispatch(openMediaViewer({ url: mediaUrl, type }));
	};

	return (
		<>
			<div className="rightbarFollowings">
				{currentUser?.media?.map((mediaItem, index) => {
					const mediaUrl = mediaItem.url;
					const mediaType =
						mediaTypes[mediaUrl] || mediaItem.type || "image/jpeg"; // Fallback to mediaItem.type if available

					return (
						<div key={index} className="rightbarFollowing">
							{mediaType.startsWith("video/") ? (
								<video
									controls
									autoPlay={false}
									loop={false}
									muted={isMuted}
									className="rightbarFollowingImg"
									src={mediaUrl}
									type={mediaType}
									onClick={() => handleMediaClick(mediaUrl, mediaType)}
								>
									Your browser does not support the video tag.
								</video>
							) : (
								<img
									className="rightbarFollowingImg"
									src={mediaUrl ? mediaUrl : "/images/avatar2.png"}
									alt=""
									onClick={() => handleMediaClick(mediaUrl, mediaType)}
								/>
							)}
						</div>
					);
				})}
			</div>
			{isOpen && <PhotoAndVideoeViewer />}{" "}
			{/* Render PhotoAndVideoeViewer if open */}
		</>
	);
};

export default ProfileUsersFriends;
