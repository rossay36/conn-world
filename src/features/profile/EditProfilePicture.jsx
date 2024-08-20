import React, { useState } from "react";
import { RingLoader } from "react-spinners";

import { FiUpload } from "react-icons/fi";

import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../homes/FirebaseApp";
import useAuth from "../../hooks/useAuth";
import { useUpdateProfilePictureMutation } from "./usersApiSlice";
import { MdCancelPresentation, MdPhotoCameraBack } from "react-icons/md";
import { useParams } from "react-router-dom";

const EditProfilePicture = () => {
	const [file, setFile] = useState(null);
	const [profileFilePreview, setProfileFilePreview] = useState(null);
	const [uploading, setUploading] = useState(false);
	const { userId } = useAuth();
	const { userId: profileUserId } = useParams();

	const [updateProfilePicture, { isError, isLoading, isSuccess }] =
		useUpdateProfilePictureMutation();

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!file) {
			return;
		}

		try {
			setUploading(true);

			// Upload file to Firebase Storage and get download URL
			const fileName = `${Date.now()}-${file.name}`;
			const storageRef = ref(storage, `profile/${fileName}`);
			const uploadTask = uploadBytesResumable(storageRef, file);
			const snapshot = await uploadTask;
			const downloadURL = await getDownloadURL(snapshot.ref);

			const initialUserData = {
				userId: userId,
				image: downloadURL,
			};

			// Call backend API to update profile picture
			await updateProfilePicture(initialUserData);

			// Reset form state
			setFile(null);
			setProfileFilePreview(null);
			setUploading(false);

			console.log("Profile picture successfully updated");
		} catch (error) {
			console.error("Error updating profile picture:", error);
			// Handle error
		} finally {
			setUploading(false);
		}
	};

	const handleProfileFileChange = async (e) => {
		e.stopPropagation();
		const selectedFiles = e.target.files[0];

		if (!selectedFiles || !isImageFiles(selectedFiles)) {
			// Validate file type (only accept images)
			alert("Please select a valid image file.");
			return;
		}

		try {
			const reader = new FileReader();
			reader.onload = () => {
				setFile(selectedFiles);
				setProfileFilePreview(reader.result);
			};
			reader.readAsDataURL(selectedFiles);
		} catch (error) {
			console.error("Error reading file:", error);
			// Handle error appropriately
		}
	};

	const isImageFiles = (file) => {
		return file.type.startsWith("image/");
	};

	const removeProfileFile = () => {
		setFile(null);
		setProfileFilePreview(null);
	};

	return (
		<>
			{userId === profileUserId && (
				<form className="profile_inputs" onSubmit={handleSubmit}>
					<div className="profile_input_container">
						<label htmlFor="profileFileInput" className="profile_file_input">
							<MdPhotoCameraBack
								style={{ color: "#fff" }}
								className="profile_Icon"
							/>
							<p className="profile_input_text">Change profile picture</p>
							<input
								style={{ display: "none" }}
								type="file"
								id="profileFileInput"
								accept="image/*"
								onChange={handleProfileFileChange}
							/>
						</label>
					</div>
					{profileFilePreview && (
						<div className="profile_filePreview">
							<div className="profile_previewList">
								<div className="profile_filePreview_items">
									<div className="profile_filePreview_imgage">
										<img
											className="profile_filePreview_img"
											src={profileFilePreview}
											alt="Preview"
										/>
										<div className="profile_remove_button_wrap">
											<button
												className="profile_file_upload_button"
												onClick={removeProfileFile}
											>
												<MdCancelPresentation />
											</button>
											<button
												type="submit"
												className="profile_file_upload_button"
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

export default EditProfilePicture;
