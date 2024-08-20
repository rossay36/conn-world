import React, { useState, useEffect } from "react";
import { countries } from "../../Dummy"; // Import your dummy data
import useAuth from "../../hooks/useAuth";
import {
	useGetUsersQuery,
	useUpdateUserLivesMutation,
} from "../../features/profile/usersApiSlice";

const EditCurrentLive = () => {
	const { userId } = useAuth();

	const { currentUser, isLoading, isError, error } = useGetUsersQuery(
		"usersList",
		{
			selectFromResult: ({ data }) => ({
				currentUser: data?.entities[userId],
			}),
		}
	);

	const [
		updateUserLives,
		{
			isSuccess,
			isLoading: loadingLives,
			isError: IsErrorLives,
			error: errorLives,
		},
	] = useUpdateUserLivesMutation();

	const initialCountry = currentUser?.lives?.currentCountry || "Select Country";
	const [selectLivesCountry, setSelectLivesCountry] = useState(initialCountry);
	const [selectLivesState, setSelectLivesState] = useState(
		currentUser?.lives?.currentState || ""
	);
	const [selectLivesLocalGovernment, setSelectLivesLocalGovernment] = useState(
		currentUser?.lives?.currentCity || ""
	);
	const [selectLivesStreet, setSelectLivesStreet] = useState(
		currentUser?.lives?.currentStreet || ""
	);

	// useEffect to set initial values based on currentUser
	useEffect(() => {
		if (currentUser) {
			setSelectLivesCountry(
				currentUser.lives?.currentCountry || "Select Country"
			);
			setSelectLivesState(currentUser.lives?.currentState || "");
			setSelectLivesLocalGovernment(currentUser.lives?.currentCity || "");
			setSelectLivesStreet(currentUser.lives?.currentStreet || "");
		}
	}, [currentUser]);

	// Function to handle selection of country postalCode
	const handleCountryChange = (e) => {
		const selectLivesCountry = e.target.value;
		if (selectLivesCountry === "Select Country") {
			setSelectLivesCountry(initialCountry);
			setSelectLivesState(currentUser?.lives?.currentState || "");
			setSelectLivesLocalGovernment(currentUser?.lives?.currentCity || "");
			setSelectLivesStreet(currentUser?.lives?.currentStreet || "");
		} else {
			setSelectLivesCountry(selectLivesCountry);
			setSelectLivesState("");
			setSelectLivesLocalGovernment("");
			setSelectLivesStreet("");
		}
	};

	const handleLivesStreetChange = (e) => {
		const selectLivesStreet = e.target.value;
		setSelectLivesStreet(selectLivesStreet);

		// Find the selected local government to get city and postal code
		const selectedLG = countries
			.find((country) => country.name === selectLivesCountry)
			?.states.find((state) => state.name === selectLivesState)
			?.localGovernments.find((lg) => lg.name === selectLivesLocalGovernment);

		if (selectedLG) {
			setSelectedPostalCode(selectedLG.postalCode);
		} else {
			setSelectedPostalCode("");
		}
	};

	if (loadingLives) {
		return <div>Loading...</div>;
	}

	if (IsErrorLives) {
		return <div>Error: {errorLives?.message}</div>;
	}

	const handleCurrentLives = async (e) => {
		e.preventDefault();
		const initialUserData = {
			currentCountry: selectLivesCountry,
			currentState: selectLivesState,
			currentCity: selectLivesLocalGovernment,
			currentStreet: selectLivesStreet,
		};
		try {
			await updateUserLives({
				userId,
				lives: initialUserData,
			}).unwrap();
		} catch (err) {
			console.log(err);
		}
	};

	if (isLoading) {
		return <div>Loading...</div>;
	}

	if (isError) {
		return <div>Error: {error.message}</div>;
	}

	return (
		<div className="EditAddress">
			<header className="EditAddress_address_title">Currently Lives In</header>
			<div className="EditAddress_address_wrap">
				<form className="EditAddress_address" onSubmit={handleCurrentLives}>
					{/* Country selection dropdown */}
					<select
						className="EditAddress_address_selections"
						value={selectLivesCountry}
						onChange={handleCountryChange}
					>
						<option value="Select Country">Select Country</option>
						{countries.map((country) => (
							<option key={country.id} value={country.name}>
								{country.name}
							</option>
						))}
					</select>
					{/* State selection dropdown */}
					{selectLivesCountry !== "Select Country" && (
						<select
							className="EditAddress_address_selections"
							value={selectLivesState}
							onChange={(e) => {
								setSelectLivesState(e.target.value);
								setSelectLivesLocalGovernment("");
								setSelectLivesStreet("");
							}}
						>
							<option value="">Select State</option>
							{countries
								.find((country) => country.name === selectLivesCountry)
								?.states.map((state) => (
									<option key={state.id} value={state.name}>
										{state.name}
									</option>
								))}
						</select>
					)}
					{/* Local Government selection dropdown */}
					{selectLivesState && (
						<select
							className="EditAddress_address_selections"
							value={selectLivesLocalGovernment}
							onChange={(e) => {
								setSelectLivesLocalGovernment(e.target.value);
								setSelectLivesStreet("");
							}}
						>
							<option value="">Select City</option>
							{countries
								.find((country) => country.name === selectLivesCountry)
								?.states.find((state) => state.name === selectLivesState)
								?.localGovernments.map((lg) => (
									<option key={lg.id} value={lg.name}>
										{lg.name}
									</option>
								))}
						</select>
					)}
					{/* Street selection dropdown */}
					{selectLivesLocalGovernment && (
						<select
							className="EditAddress_address_selections"
							value={selectLivesStreet}
							onChange={handleLivesStreetChange}
						>
							<option value="">Select Street</option>
							{countries
								.find((country) => country.name === selectLivesCountry)
								?.states.find((state) => state.name === selectLivesState)
								?.localGovernments.find(
									(lg) => lg.name === selectLivesLocalGovernment
								)
								?.streets.map((street) => (
									<option key={street} value={street}>
										{street}
									</option>
								))}
						</select>
					)}
					<button className="EditAddress_button">Save Address</button>
				</form>
				{/* Display selectLives details */}
				<div className="EditAddress_selected_detail">
					<div className="EditAddress_selection_details">
						<p className="EditAddress_selected_details_key">Country:</p>
						<p className="EditAddress_selected_details_value">
							{selectLivesCountry}
						</p>
					</div>
					<div className="EditAddress_selection_details">
						<p className="EditAddress_selected_details_key">State:</p>
						<p className="EditAddress_selected_details_value">
							{selectLivesState}
						</p>
					</div>
					<div className="EditAddress_selection_details">
						<p className="EditAddress_selected_details_key">City:</p>
						<p className="EditAddress_selected_details_value">
							{selectLivesLocalGovernment}
						</p>
					</div>
					<div className="EditAddress_selection_details">
						<p className="EditAddress_selected_details_key">Street:</p>
						<p className="EditAddress_selected_details_value">
							{selectLivesStreet}
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default EditCurrentLive;
