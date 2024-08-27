import React, { useState, useRef, useEffect } from "react";
import { getStorage, ref, getMetadata } from "firebase/storage";
import "./MediaImageAndVideoController.css";
import { useDispatch } from "react-redux";
import { openMediaViewer } from "../../features/auth/mediaSlice";
const MediaImageAndVideoController = ({
	mediaUrls = [],
	initialMuted = true,
	onClick,
}) => {
	const [mediaTypes, setMediaTypes] = useState({});
	const [isMuted, setIsMuted] = useState(initialMuted);
	const videoRefs = useRef({});
	const dispatch = useDispatch();

	useEffect(() => {
		const fetchMediaTypes = async () => {
			const validMediaUrls = mediaUrls.filter((url) => url); // Filter out empty URLs

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

		fetchMediaTypes();
	}, [mediaUrls]);

	const handleMediaClick = (mediaUrl) => {
		const type = mediaTypes[mediaUrl]?.startsWith("video/") ? "video" : "image";
		dispatch(openMediaViewer({ url: mediaUrl, type }));
	};

	const containerClass = () => {
		const numMedia = mediaUrls.length;
		return numMedia === 2
			? "MediaImageAndVideoController_img_container_double"
			: numMedia === 3
			? "MediaImageAndVideoController_img_container_triple"
			: numMedia === 4
			? "MediaImageAndVideoController_img_container_four"
			: numMedia > 4
			? "MediaImageAndVideoController_img_container_multiple"
			: "MediaImageAndVideoController_img_container_single";
	};

	return (
		<div className="MediaImageAndVideoController">
			{mediaUrls.length > 0 && (
				<div className={containerClass()}>
					{mediaUrls.map((mediaUrl) => (
						<div
							key={mediaUrl}
							className={
								mediaUrls.length === 2
									? "MediaImageAndVideoController_item_double"
									: mediaUrls.length === 3
									? "MediaImageAndVideoController_item_triple"
									: mediaUrls.length === 4
									? "MediaImageAndVideoController_item_four"
									: mediaUrls.length === 5
									? "MediaImageAndVideoController_item_five"
									: mediaUrls.length === 6
									? "MediaImageAndVideoController_item_six"
									: "MediaImageAndVideoController_item"
							}
						>
							{mediaTypes[mediaUrl]?.startsWith("video/") ? (
								<video
									ref={(el) => (videoRefs.current[mediaUrl] = el)}
									controls
									autoPlay={false}
									muted={isMuted}
									onClick={() => handleMediaClick(mediaUrl)}
									className="postVideos"
								>
									<source src={mediaUrl} type={mediaTypes[mediaUrl]} />
									Your browser does not support the video tag.
								</video>
							) : (
								<img
									className="comment_imgs"
									src={mediaUrl}
									alt="media"
									onClick={() => handleMediaClick(mediaUrl)}
								/>
							)}
						</div>
					))}
				</div>
			)}
		</div>
	);
};

export default MediaImageAndVideoController;
