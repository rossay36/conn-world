import React, { useEffect, useRef, useState } from "react";
import { ImLocation } from "react-icons/im";
import { RiEmotionLine } from "react-icons/ri";
import { FcCancel } from "react-icons/fc";
import "./filePreview.css";

import { Link } from "react-router-dom";
import { useGetUsersQuery } from "../../features/profile/usersApiSlice";
import { useAddNewPostMutation } from "../../features/homes/postsApiSlice";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../../features/homes/FirebaseApp";

import useAuth from "../../hooks/useAuth";
import "./share.css";
import { RingLoader } from "react-spinners";
import { GrTag } from "react-icons/gr";
import { LiaPhotoVideoSolid } from "react-icons/lia";

const IMG_URL = import.meta.env.VITE_PUBLIC_FOLDER;

const Share = ({ isShareVisible, shareDrop }) => {
	const errRef = useRef();

	const [text, setText] = useState("");
	const [files, setFiles] = useState([]);
	const [filePreviews, setFilePreviews] = useState([]);
	const [uploading, setUploading] = useState(false);
	const [errMsg, setErrMsg] = useState("");

	const { userId } = useAuth();

	const { user } = useGetUsersQuery("usersList", {
		selectFromResult: ({ data }) => ({
			user: data?.entities[userId],
		}),
	});

	useEffect(() => {
		setErrMsg("");
	}, [text, files]);

	const [addNewPost, { isLoading }] = useAddNewPostMutation(); // Use the mutation hook

	const handleShare = async () => {
		setUploading(true);

		try {
			const fileUrls = await Promise.all(
				files.map(async (file) => {
					const fileName = `${Date.now()}-${file.name}`;
					const storageRef = ref(storage, `posts/${fileName}`);
					const uploadTask = uploadBytesResumable(storageRef, file);
					const snapshot = await uploadTask;
					const downloadURL = await getDownloadURL(snapshot.ref);
					return downloadURL;
				})
			);

			const initialPostData = {
				user: userId,
				text: text,
				image: fileUrls,
			};

			await addNewPost(initialPostData);

			setText("");
			setFiles([]);
			setFilePreviews([]); // Clear file previews

			setUploading(false);

			console.log("Post created successfully");
		} catch (err) {
			if (err.response) {
				// Server responded with an error
				setErrMsg(err.response.data.message || "An error occurred");
			} else {
				// Network error or other issues
				setErrMsg("Network error. Please try again later.");
			}
			errRef?.current?.focus();
		}
	};

	const handleFileChange = async (e) => {
		const selectedFiles = Array.from(e.target.files);

		try {
			const newPreviews = await Promise.all(
				selectedFiles.map((file) => {
					return new Promise((resolve, reject) => {
						const reader = new FileReader();
						reader.onload = (event) => {
							resolve(event.target.result);
						};
						reader.readAsDataURL(file);
					});
				})
			);

			setFilePreviews([...filePreviews, ...newPreviews]);
			setFiles([...files, ...selectedFiles]); // Add selected files to state
		} catch (error) {
			console.error("Error reading file:", error);
			// Handle error appropriately
		}
	};

	const removeFile = (index) => {
		setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
		setFilePreviews((prevPreviews) =>
			prevPreviews.filter((_, i) => i !== index)
		);
	};

	const preventDefault = (e) => {
		e.preventDefault(); // Prevent default form submission
	};

	const errClass = errMsg ? "errmsg" : "offscreen";

	if (isLoading) {
		return (
			<p>
				posting <RingLoader size={20} margin="auto" color="#000" />
			</p>
		);
	}

	return (
		<div>
			<div className="shareWrapper">
				<div className="shareTop">
					<Link to={`/home/${user?._id}`}>
						<img
							className="shareProfileImg"
							src={
								user?.profilePicture
									? user?.profilePicture
									: IMG_URL + "avatar2.png"
							}
							alt="img"
						/>
					</Link>
					<input
						placeholder={`What's in your mind ${user?.username}?`}
						className="shareInput"
						value={text}
						onChange={(e) => setText(e.target.value)}
					/>
				</div>
				<hr className="shareHr" />
				<form className="shareBottom" onSubmit={preventDefault}>
					<div className="shareOptions">
						<div className="shareOption">
							<label htmlFor="fileInput" className="fileInput">
								<LiaPhotoVideoSolid
									title="Photo or Video"
									style={{ color: "tomato" }}
									className="shareIcon"
								/>
								<input
									style={{ display: "none" }}
									type="file"
									id="fileInput"
									accept="image/*, video/*"
									multiple
									onChange={handleFileChange}
								/>
							</label>
						</div>
						<div className="shareOption">
							<GrTag
								title="Tag"
								style={{ color: "blue" }}
								className="shareIcon"
							/>
						</div>
						<div className="shareOption">
							<ImLocation
								title="Location"
								style={{ color: "green" }}
								className="shareIcon"
							/>
						</div>
						<div className="shareOption">
							<RiEmotionLine
								title="Feelings"
								style={{ color: "goldenrod" }}
								className="shareIcon"
							/>
						</div>
					</div>
					<div className="filePreview">
						{filePreviews.length > 0 && (
							<div className="previewList">
								{filePreviews.map((preview, index) => (
									<div key={index} className="filePreview_items">
										<div className="filePreview_imgage">
											<img
												className="filePreview_img"
												src={preview}
												alt={`Preview ${index}`}
											/>
											<button
												className="removeFileButton"
												onClick={() => removeFile(index)}
											>
												<FcCancel className="removeFileButton_icon" />
											</button>
										</div>
									</div>
								))}
							</div>
						)}
					</div>
					<button className="shareButton" onClick={handleShare}>
						{isLoading ? (
							<RingLoader size={20} margin="auto" color="#000" />
						) : (
							"Share"
						)}
					</button>
				</form>
			</div>
		</div>
	);
};

export default Share;
