import React, { useState } from "react";
import { storage } from "../FirebaseApp";
import useButton from "../../../hooks/useButton";
import { MdOutlinePermMedia } from "react-icons/md";
import { RingLoader } from "react-spinners";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { FcCancel } from "react-icons/fc";
import useAuth from "../../../hooks/useAuth";
import { LiaPhotoVideoSolid } from "react-icons/lia";

const SinglePostForm = ({ post, handleCommentAdded }) => {
	const [commentText, setCommentText] = useState("");
	const [files, setFiles] = useState([]);
	const [commentfilePreviews, setCommentFilePreviews] = useState([]);
	const [uploadings, setUploadings] = useState(false);
	const { userId, username } = useAuth();

	const {
		handleAddComment,
		isLoading: buttonLoading,
		error: buttonError,
	} = useButton();

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!commentText.trim()) {
			return;
		}

		try {
			setUploadings(true);

			// Upload files to Firebase Storage and get download URLs
			const fileUrls = await Promise.all(
				files.map(async (file) => {
					const fileName = `${Date.now()}-${file.name}`;
					const storageRef = ref(storage, `comments/${fileName}`);
					const uploadTask = uploadBytesResumable(storageRef, file);
					const snapshot = await uploadTask;
					const downloadURL = await getDownloadURL(snapshot.ref);
					return downloadURL;
				})
			);

			// Call backend API to create new comment
			await handleAddComment({
				user: userId,
				post: post?._id,
				desc: commentText,
				commentImage: fileUrls, // Pass array of download URLs
			});

			// Reset form state
			setCommentText("");
			setFiles([]);
			setCommentFilePreviews([]);
			setUploadings(false);

			// Notify parent component to update comments
			if (handleCommentAdded) {
				handleCommentAdded();
			}

			console.log("Comment successfully added");
		} catch (error) {
			console.error("Error adding comment:", error);
			// Handle error
		} finally {
			setUploadings(false);
		}
	};

	const handleCommentFileChange = async (e) => {
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

			setCommentFilePreviews([...commentfilePreviews, ...newPreviews]);
			setFiles([...files, ...selectedFiles]); // Add selected files to state
		} catch (error) {
			console.error("Error reading file:", error);
			// Handle error appropriately
		}
	};

	const removeCommentFile = (index) => {
		// Remove file and preview at the specified index
		setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
		setCommentFilePreviews((prevPreviews) =>
			prevPreviews.filter((_, i) => i !== index)
		);
	};
	return (
		<form className="SinglePostForm_inputs" onSubmit={handleSubmit}>
			<div className="comment_input_container">
				<label htmlFor="singleFileInputs" className="SinglePostForm_file_input">
					<LiaPhotoVideoSolid
						style={{ color: "tomato" }}
						className="shareIcon"
					/>
					<input
						style={{ display: "none" }}
						type="file"
						id="singleFileInputs"
						accept="image/*, video/*"
						multiple
						onChange={handleCommentFileChange}
					/>
				</label>
				<input
					placeholder={`${username} comment ${post?.username} post`}
					className="SinglePostForm_input"
					value={commentText}
					onChange={(e) => setCommentText(e.target.value)}
				/>
			</div>
			<button
				type="submit"
				className="SinglePostForm_button_input"
				disabled={buttonLoading}
			>
				{buttonLoading ? (
					<RingLoader size={20} margin="auto" color="#000" />
				) : (
					"Send"
				)}
			</button>
			<div className="comment_filePreview">
				{commentfilePreviews.length > 0 && (
					<div className="comment_previewList">
						{commentfilePreviews.map((preview, index) => (
							<div key={index} className="comment_filePreview_items">
								<div className="comment_filePreview_imgage">
									<img
										className="comment_filePreview_img"
										src={preview}
										alt={`Preview ${index}`}
									/>
									<button
										className="comment_removeFileButton"
										onClick={() => removeCommentFile(index)}
									>
										<FcCancel className="comment_removeFileButton_icon" />
									</button>
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</form>
	);
};

export default SinglePostForm;
