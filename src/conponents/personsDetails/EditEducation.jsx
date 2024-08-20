import React, { useState, useEffect } from "react";

import useAuth from "../../hooks/useAuth";
import {
	useGetUsersQuery,
	useUpdateEducationMutation,
} from "../../features/profile/usersApiSlice";

// Function to generate an array of years from startYear to endYear
const generateYears = (startYear, endYear) => {
	const years = [];
	for (let year = startYear; year <= endYear; year++) {
		years.push(year);
	}
	return years;
};

const EditEducation = () => {
	const { userId } = useAuth();
	const [
		updateEducation,
		{
			isSuccess,
			isLoading: loadingEducation,
			isError: IsErrorEducation,
			error: errorEducation,
		},
	] = useUpdateEducationMutation();

	const { currentUser, isLoading, isError, error } = useGetUsersQuery(
		"usersList",
		{
			selectFromResult: ({ data }) => ({
				currentUser: data?.entities[userId],
			}),
		}
	);

	// Initial values from currentUser or dummy data
	const initialCollege = currentUser?.education?.college || "Add Collage";
	const initialUniversity =
		currentUser?.education?.university || "Add University";
	const initialDegree = currentUser?.education?.degree || "Add Degree";
	const initialFieldOfStudy =
		currentUser?.education?.fieldOfStudy || "Add Courses";
	const initialStartYear = currentUser?.education?.startYear || 0;
	const initialEndYear = currentUser?.education?.endYear || 0;

	const [college, setCollege] = useState(initialCollege);
	const [university, setUniversity] = useState(initialUniversity);
	const [degree, setDegree] = useState(initialDegree);
	const [fieldOfStudy, setFieldOfStudy] = useState(initialFieldOfStudy);
	const [startYear, setStartYear] = useState(initialStartYear);
	const [endYear, setEndYear] = useState(initialEndYear);

	// useEffect to set initial values based on currentUser
	useEffect(() => {
		if (currentUser) {
			setCollege(currentUser.education?.college || "Add Collage");
			setUniversity(currentUser.education?.university || "Add University");
			setDegree(currentUser.education?.degree || "Add Degree");
			setFieldOfStudy(currentUser.education?.fieldOfStudy || "Add Courses");
			setStartYear(currentUser.education?.startYear || 0);
			setEndYear(currentUser.education?.endYear || 0);
		}
	}, [currentUser]);

	// Function to handle saving education details
	if (loadingEducation) {
		return <div>Loading...</div>;
	}

	if (IsErrorEducation) {
		return <div>Error: {errorEducation?.message}</div>;
	}

	const handleEducation = async (e) => {
		e.preventDefault();
		const initialUserData = {
			college: college,
			university: university,
			degree: degree,
			fieldOfStudy: fieldOfStudy,
			startYear: startYear,
			endYear: endYear,
		};
		try {
			await updateEducation({
				userId,
				education: initialUserData,
			}).unwrap();
		} catch (err) {}
	};

	if (isLoading) {
		return <div>Loading...</div>;
	}

	if (isError) {
		return <div>Error: {error.message}</div>;
	}

	return (
		<div className="EditEducation">
			<header className="EditEducation_title">Education Details</header>
			<form className="EditEducation_details" onSubmit={handleEducation}>
				{/* College input field */}
				<input
					type="text"
					className="EditEducation_input"
					value={college}
					onChange={(e) => setCollege(e.target.value)}
					placeholder="College"
				/>

				{/* University input field */}
				<input
					type="text"
					className="EditEducation_input"
					value={university}
					onChange={(e) => setUniversity(e.target.value)}
					placeholder="University"
				/>

				{/* Degree input field */}
				<input
					type="text"
					className="EditEducation_input"
					value={degree}
					onChange={(e) => setDegree(e.target.value)}
					placeholder="Degree"
				/>

				{/* Field of Study input field */}
				<input
					type="text"
					className="EditEducation_input"
					value={fieldOfStudy}
					onChange={(e) => setFieldOfStudy(e.target.value)}
					placeholder="Field of Study"
				/>

				{/* Start Year selection dropdown */}
				<select
					className="EditEducation_select"
					value={startYear}
					onChange={(e) => setStartYear(Number(e.target.value))}
				>
					<option value={0}>Select Start Year</option>
					{generateYears(1990, new Date().getFullYear()).map((year) => (
						<option key={year} value={year}>
							{year}
						</option>
					))}
				</select>

				{/* End Year selection dropdown */}
				<select
					className="EditEducation_select"
					value={endYear}
					onChange={(e) => setEndYear(Number(e.target.value))}
				>
					<option value={0}>Select End Year</option>
					{generateYears(1990, new Date().getFullYear()).map((year) => (
						<option key={year} value={year}>
							{year}
						</option>
					))}
				</select>

				{/* Save button */}
				<button className="EditEducation_button">Save Education Details</button>
			</form>
		</div>
	);
};

export default EditEducation;
