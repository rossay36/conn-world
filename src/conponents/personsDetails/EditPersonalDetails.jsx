import React, { useState, useEffect } from "react";
import useAuth from "../../hooks/useAuth"; // Custom hook for authentication
import {
	useDeleteUserMutation,
	useUpdatePersonalDetailsMutation,
	useGetUsersQuery,
} from "../../features/profile/usersApiSlice";
import { useNavigate } from "react-router-dom";
import { MdOutlineCancel, MdWarning } from "react-icons/md";

const EditPersonalDetails = () => {
	const { userId } = useAuth(); // Custom hook to get authenticated user's ID
	const [deleteToggle, setDeleteToggle] = useState(false);
	const Navigate = useNavigate();
	const [agreeTerms, setAgreeTerms] = useState(false);

	const { currentUser, isLoading, isError, error } = useGetUsersQuery(
		"usersList",
		{
			selectFromResult: ({ data }) => ({
				currentUser: data?.entities[userId],
			}),
		}
	);

	const [
		deleteUser,
		{ isSuccess, isLoading: delLoading, isError: delIsError, error: delError },
	] = useDeleteUserMutation();

	const [
		updatePersonalDetails,
		{
			isSuccess: isSuccessDetails,
			isLoading: detailsLoading,
			isError: dDetailssError,
			error: detailsError,
		},
	] = useUpdatePersonalDetailsMutation();

	// State variables for form inputs
	const [username, setUsername] = useState("");
	const [firstname, setFirstname] = useState("");
	const [lastname, setLastname] = useState("");
	const [email, setEmail] = useState("");
	const [bio, setBio] = useState("");
	const [gender, setGender] = useState("");
	const [relationship, setRelationship] = useState("");
	const [job, setJob] = useState("");
	const [workAt, setWorkAt] = useState("");

	// useEffect to set initial form values from currentUser
	useEffect(() => {
		if (currentUser) {
			setUsername(currentUser.username);
			setFirstname(currentUser.firstname);
			setLastname(currentUser.lastname);
			setEmail(currentUser.email);
			setBio(currentUser.bio || "");
			setGender(currentUser.gender || "");
			setRelationship(currentUser.relationship || "");
			setJob(currentUser.job || "");
			setWorkAt(currentUser.workAt || "");
		}
	}, [currentUser]);

	// Handle form submission
	const handleSubmit = async (e) => {
		e.preventDefault();

		// Prepare updated user details object
		const initialUserData = {
			userId: userId,
			username,
			firstname,
			lastname,
			email,
			bio,
			gender,
			relationship,
			job,
			workAt,
		};

		// Example logic to update user details (replace with actual API call)
		try {
			const response = await updatePersonalDetails(initialUserData);
			console.log("User details updated:", response);
			// Handle success (e.g., show success message, update state)
		} catch (error) {
			console.error("Error updating user details:", error);
			// Handle error (e.g., show error message)
		}
	};

	// Render loading state while fetching currentUser
	if (isLoading) {
		return <div>Loading...</div>;
	}

	// Render error state if there's an issue fetching currentUser
	if (isError) {
		return <div>Error: {error.message}</div>;
	}

	const handleDeleteTrue = () => {
		setDeleteToggle(true);
	};
	const handleDeleteFalse = () => {
		setDeleteToggle(false);
	};

	if (delLoading) {
		return <p>Loading...</p>;
	}
	if (delIsError) {
		return <p>{delError?.message}</p>;
	}

	// Function to handle deletion of user
	const handleDeleteUser = async () => {
		try {
			const response = await deleteUser({ userId: userId });
			console.log("User deletion response:", response);
			if (
				response?.data?.message ===
				`User ${currentUser?.username} deleted successfully`
			) {
				Navigate("/"); // Redirect after successful deletion
			}
		} catch (error) {
			console.error("Error deleting user:", error);
			// Handle error (e.g., show error message to user)
		}
	};

	const sex =
		currentUser?.gender === "Male"
			? "Mr"
			: currentUser?.gender === "Female"
			? "Mrs"
			: null;

	const acceptHandle = () => {
		setAgreeTerms((prev) => !prev);
	};

	// Render the form once currentUser data is loaded
	return (
		<div className="EditPersonalDetail">
			<header className="EditAddress_address_title">Personal Details</header>
			<form onSubmit={handleSubmit} className="EditPersonalDetail_form">
				{/* Username input field */}
				<input
					className="EditPersonalDetails_input"
					type="text"
					value={username}
					onChange={(e) => setUsername(e.target.value)}
					placeholder="Username"
					required
				/>

				{/* Firstname input field */}
				<input
					className="EditPersonalDetails_input"
					type="text"
					value={firstname}
					onChange={(e) => setFirstname(e.target.value)}
					placeholder="Firstname"
					required
				/>

				{/* Lastname input field */}
				<input
					className="EditPersonalDetails_input"
					type="text"
					value={lastname}
					onChange={(e) => setLastname(e.target.value)}
					placeholder="Lastname"
					required
				/>

				{/* Email input field */}
				<input
					className="EditPersonalDetails_input"
					type="email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					placeholder="Email"
					required
				/>

				{/* Bio input field */}
				<textarea
					className="EditPersonalDetails_inputs"
					value={bio}
					onChange={(e) => setBio(e.target.value)}
					placeholder="Bio"
				/>

				{/* Gender input field */}
				<select
					className="EditPersonalDetails_select"
					value={gender}
					onChange={(e) => setGender(e.target.value)}
					required
				>
					<option value="">Select Gender</option>
					<option value="male">Male</option>
					<option value="female">Female</option>
					<option value="non-binary">Non-binary</option>
					<option value="genderqueer">Genderqueer</option>
					<option value="genderfluid">Genderfluid</option>
					<option value="agender">Agender</option>
					<option value="bigender">Bigender</option>
					<option value="other">Other</option>
				</select>

				{/* Relationship input field */}
				<select
					className="EditPersonalDetails_select"
					value={relationship}
					onChange={(e) => setRelationship(e.target.value)}
					required
				>
					<option value="">Select Relationship Status</option>
					<option value="Single">Single</option>
					<option value="Married">Married</option>
					<option value="Engaged">Engaged</option>
					<option value="In a relationship">In a relationship</option>
					<option value="Complicated">Complicated</option>
					<option value="Not interested">Not interested</option>
					<option value="Divorced">Divorced</option>
					<option value="Widow">Widow</option>
					<option value="Widower">Widower</option>
					<option value="Other">Other</option>
				</select>

				{/* Job input field */}
				<input
					className="EditPersonalDetails_input"
					type="text"
					value={job}
					onChange={(e) => setJob(e.target.value)}
					placeholder="Job"
				/>

				{/* WorkAt input field */}
				<input
					className="EditPersonalDetails_input"
					type="text"
					value={workAt}
					onChange={(e) => setWorkAt(e.target.value)}
					placeholder="WorkAt"
				/>

				{/* Submit button */}
				<button className="EditEducation_button" type="submit">
					Save Personal Details
				</button>
			</form>
			<div className="user_button_delete_container">
				{deleteToggle ? (
					<button
						className="user_button_delete_toggle"
						onClick={handleDeleteFalse}
					>
						Cancel
					</button>
				) : (
					<button
						className="user_button_delete_toggle"
						onClick={handleDeleteTrue}
					>
						DELETE YOUR ACCOUNT
					</button>
				)}
				{deleteToggle && (
					<div className="user_button_delete_wrap">
						<div className="user_deleting_warning">
							<header className="user_delete_header">
								<span className="user_button_header_text">
									Warning: Deleting Your Account
								</span>
								<MdWarning className="user_delete_text_icon" />
								<MdOutlineCancel
									className="user_delete_text_icon_cancel"
									onClick={handleDeleteFalse}
								/>
							</header>
							<h2 className="user_deleting_username">
								Dear {sex} {currentUser?.username} ,
							</h2>
							<article className="user_deleting_note">
								<p className="user_deleting_note_text">
									Before you proceed with deleting your account, please note
									that this action is irreversible and will result in the
									permanent loss of all your data, including posts, pictures,
									videos, comments, likes, friends, and any other information
									associated with your account.
								</p>
								<p className="user_deleting_note_text">
									Once your account is deleted, it cannot be recovered. If you
									are sure about deleting your account and understand the
									consequences, please proceed by confirming your decision
									below.
								</p>
								<p className="user_deleting_note_text">
									Thank you for being a part of our community.
								</p>
								<p className="user_deleting_note_text">Best regards,</p>
								<p className="user_deleting_note_text">Conn-World Team</p>
							</article>
						</div>
						<div className="user_button_delete_contain">
							<div className="user_button_delete_agree">
								<span className="user_button_delete_accept">
									I HAVE READ AND ACCEPT
								</span>
								<input
									className="user_button_delete_input"
									type="checkbox"
									onClick={acceptHandle}
								/>
							</div>
							<button
								className="user_button_delete_btn"
								onClick={handleDeleteUser}
								disabled={!agreeTerms}
							>
								DELETE
							</button>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default EditPersonalDetails;
