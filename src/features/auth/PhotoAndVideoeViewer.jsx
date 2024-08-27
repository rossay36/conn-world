import React from "react";
import "./mediaViewer.css";
import { useDispatch, useSelector } from "react-redux";
import { closeMediaViewer, openMediaViewer, selectMedia } from "./mediaSlice";

const PhotoAndVideoeViewer = () => {
	const dispatch = useDispatch();
	const { mediaUrl, mediaType, isOpen, nextVideoUrl } =
		useSelector(selectMedia);

	const handleClose = () => {
		dispatch(closeMediaViewer());
	};

	const handleNextVideo = () => {
		if (nextVideoUrl) {
			dispatch(closeMediaViewer());
			dispatch(openMediaViewer({ url: nextVideoUrl, type: "video" }));
		}
	};

	if (!isOpen) return null; // Ensure the component is not rendered when not needed

	return (
		<div className="mediaViewerModal">
			{mediaType === "image" ? (
				<img src={mediaUrl} alt="Expanded Media" className="expandedMedia" />
			) : mediaType === "video" ? (
				<div className="videoContainer">
					<video
						src={mediaUrl}
						controls
						autoPlay={false}
						className="expandedMedia"
						onEnded={handleNextVideo}
					/>
				</div>
			) : null}
			<button onClick={handleClose} className="closeButton">
				Close
			</button>
		</div>
	);
};

export default PhotoAndVideoeViewer;
