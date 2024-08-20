import React, { useState } from "react";
import { RingLoader } from "react-spinners";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../homes/FirebaseApp";
import useAuth from "../../hooks/useAuth";
import { FiUpload } from "react-icons/fi";

import { useUpdateCoverPictureMutation } from "./usersApiSlice";
import { MdCancelPresentation, MdPhotoCameraBack } from "react-icons/md";
import { useParams } from "react-router-dom";

const EditCoverPicture = () => {
	const [file, setFile] = useState(null);
	const [coverFilePreview, setCoverFilePreview] = useState(null);
	const [uploading, setUploading] = useState(false);
	const { userId } = useAuth();
	const { userId: profileUserId } = useParams();

	const [updateCoverPicture, { isError, isLoading, isSuccess }] =
		useUpdateCoverPictureMutation();

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!file) {
			return;
		}

		try {
			setUploading(true);

			// Upload file to Firebase Storage and get download URL
			const fileName = `${Date.now()}-${file.name}`;
			const storageRef = ref(storage, `cover/${fileName}`);
			const uploadTask = uploadBytesResumable(storageRef, file);
			const snapshot = await uploadTask;
			const downloadURL = await getDownloadURL(snapshot.ref);

			// Call backend API to update cover picture
			const initialUserData = {
				userId: userId,
				image: downloadURL,
			};
			
			await updateCoverPicture(initialUserData);

			// Reset form state
			setFile(null);
			setCoverFilePreview(null);
			setUploading(false);

			console.log("Cover picture successfully updated");
		} catch (error) {
			console.error("Error updating cover picture:", error);
			// Handle error
		} finally {
			setUploading(false);
		}
	};

	const handleCoverFileChange = async (e) => {
		e.stopPropagation();
		const selectedFile = e.target.files[0];

		if (!selectedFile || !isImageFile(selectedFile)) {
			// Validate file type (only accept images)
			alert("Please select a valid image file.");
			return;
		}

		try {
			const reader = new FileReader();
			reader.onload = () => {
				setFile(selectedFile);
				setCoverFilePreview(reader.result);
			};
			reader.readAsDataURL(selectedFile);
		} catch (error) {
			console.error("Error reading file:", error);
			// Handle error appropriately
		}
	};

	const isImageFile = (file) => {
		return file.type.startsWith("image/");
	};

	const removeFile = () => {
		setFile(null);
		setCoverFilePreview(null); // Corrected variable name
	};

	return (
		<>
			{userId === profileUserId && (
				<form className="cover_inputs" onSubmit={handleSubmit}>
					<div className="cover_input_container">
						<label htmlFor="coverFileInput" className="cover_file_input">
							<MdPhotoCameraBack
								style={{ color: "#fff" }}
								className="cover_Icon"
							/>
							<p className="cover_input_text">Change cover picture</p>
							<input
								style={{ display: "none" }}
								type="file"
								id="coverFileInput"
								accept="image/*"
								onChange={handleCoverFileChange}
							/>
						</label>
					</div>
					{coverFilePreview && (
						<div className="cover_filePreview">
							<div className="cover_previewList">
								<div className="cover_filePreview_items">
									<div className="cover_filePreview_imgage">
										<img
											className="cover_filePreview_img"
											src={coverFilePreview}
											alt="Preview"
										/>
										<div className="cover_remove_button_wrap">
											<button
												className="cover_file_upload_button"
												onClick={removeFile}
											>
												<MdCancelPresentation />
											</button>
											<button
												type="submit"
												className="cover_file_upload_button"
												disabled={isLoading}
											>
												{isLoading ? (
													<RingLoader size={20} margin="auto" color="#fff" />
												) : (
													<FiUpload />
												)}
											</button>
										</div>
									</div>
								</div>
							</div>
						</div>
					)}
				</form>
			)}
		</>
	);
};

export default EditCoverPicture;
