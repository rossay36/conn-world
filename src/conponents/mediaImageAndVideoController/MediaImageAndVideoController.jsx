import React, { useState, useRef, useEffect } from "react";
import { getStorage, ref, getMetadata } from "firebase/storage";
// import "./MediaImageAndVideoController.css"; // Your styles for this component

const MediaImageAndVideoController = ({
	mediaUrls = [],
	initialMuted = true,
	onClick,
}) => {
	const [mediaTypes, setMediaTypes] = useState({});
	const [isMuted, setIsMuted] = useState(initialMuted);
	const videoRefs = useRef({});

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

	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					const video = videoRefs.current[entry.target.src];
					if (video) {
						if (entry.isIntersecting) {
							video.play();
							video.muted = isMuted;
						} else {
							video.pause();
							video.currentTime = 0;
						}
					}
				});
			},
			{ threshold: 0.5 }
		);

		Object.values(videoRefs.current).forEach((video) => {
			if (video) observer.observe(video);
		});

		return () => {
			Object.values(videoRefs.current).forEach((video) => {
				if (video) observer.unobserve(video);
			});
		};
	}, [isMuted, mediaUrls]);

	const handleMuteToggle = () => {
		setIsMuted((prevMuted) => {
			const newMuted = !prevMuted;
			Object.values(videoRefs.current).forEach((video) => {
				if (video) video.muted = newMuted;
			});
			return newMuted;
		});
	};

	const containerClass = () => {
		const numMedia = mediaUrls.length;
		return numMedia === 2
			? "comment_img_container_double"
			: numMedia === 3
			? "comment_img_container_triple"
			: numMedia === 4
			? "comment_img_container_four"
			: numMedia > 4
			? "comment_img_container_multiple"
			: "comment_img_container_single";
	};

	return (
		<>
			{mediaUrls.length > 0 && (
				<div className={containerClass()}>
					{mediaUrls.map((mediaUrl) => (
						<div
							key={mediaUrl}
							className={
								mediaUrls.length === 2
									? "comment_item_double"
									: mediaUrls.length === 3
									? "comment_item_triple"
									: mediaUrls.length === 4
									? "comment_item_four"
									: mediaUrls.length === 5
									? "comment_item_five"
									: mediaUrls.length === 6
									? "comment_item_six"
									: "comment_item"
							}
						>
							{mediaTypes[mediaUrl]?.startsWith("video/") ? (
								<video
									ref={(el) => (videoRefs.current[mediaUrl] = el)}
									controls
									autoPlay
									muted={isMuted}
									loop
									onClick={handleMuteToggle}
									className={`postVideos ${mediaUrls.length}`}
								>
									<source src={mediaUrl} type={mediaTypes[mediaUrl]} />
									Your browser does not support the video tag.
								</video>
							) : (
								<img
									className={`comment_imgs ${mediaUrls.length}`}
									src={mediaUrl}
									alt="media"
									onClick={() => onClick && onClick(mediaUrl)}
								/>
							)}
						</div>
					))}
				</div>
			)}
		</>
	);
};

export default MediaImageAndVideoController;
