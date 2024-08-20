import React, { useState, useEffect } from "react";
import { countries } from "../../Dummy"; // Import your dummy data
import useAuth from "../../hooks/useAuth";
import {
	useGetUsersQuery,
	useUpdateUserAddressMutation,
} from "../../features/profile/usersApiSlice";

const EditAddress = () => {
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
		updateUserAddress,
		{
			isSuccess,
			isLoading: loadingAddress,
			isError: IsErrorAddress,
			error: errorAddress,
		},
	] = useUpdateUserAddressMutation();

	const initialCountry = currentUser?.address?.country || "Select Country";
	const [selectedCountry, setSelectedCountry] = useState(initialCountry);
	const [selectedState, setSelectedState] = useState(
		currentUser?.address?.state || ""
	);
	const [selectedLocalGovernment, setSelectedLocalGovernment] = useState(
		currentUser?.address?.city || ""
	);
	const [selectedStreet, setSelectedStreet] = useState(
		currentUser?.address?.street || ""
	);
	const [selectedPostalCode, setSelectedPostalCode] = useState(
		currentUser?.address?.postalCode || ""
	);

	// useEffect to set initial values based on currentUser
	useEffect(() => {
		if (currentUser) {
			setSelectedCountry(currentUser.address?.country || "Select Country");
			setSelectedState(currentUser.address?.state || "");
			setSelectedLocalGovernment(currentUser.address?.city || "");
			setSelectedStreet(currentUser.address?.street || "");
		}
	}, [currentUser]);

	// Function to handle selection of country postalCode
	const handleCountryChange = (e) => {
		const selectedCountry = e.target.value;
		if (selectedCountry === "Select Country") {
			setSelectedCountry(initialCountry);
			setSelectedState(currentUser?.address?.state || "");
			setSelectedLocalGovernment(currentUser?.address?.city || "");
			setSelectedStreet(currentUser?.address?.street || "");
			setSelectedPostalCode(currentUser?.address?.postalCode || "");
		} else {
			setSelectedCountry(selectedCountry);
			setSelectedState("");
			setSelectedLocalGovernment("");
			setSelectedStreet("");
			setSelectedPostalCode("");
		}
	};

	// Function to handle selection of streets
	const handleStreetChange = (e) => {
		const selectedStreet = e.target.value;
		setSelectedStreet(selectedStreet);

		// Find the selected local government to get city and postal code
		const selectedLG = countries
			.find((country) => country.name === selectedCountry)
			?.states.find((state) => state.name === selectedState)
			?.localGovernments.find((lg) => lg.name === selectedLocalGovernment);

		if (selectedLG) {
			setSelectedPostalCode(selectedLG.postalCode);
		} else {
			setSelectedPostalCode("");
		}
	};

	if (loadingAddress) {
		return <div>Loading...</div>;
	}

	if (isError) {
		return <div>Error: {errorAddress?.message}</div>;
	}

	const handleAdress = async (e) => {
		e.preventDefault();
		const initialUserData = {
			country: selectedCountry,
			state: selectedState,
			city: selectedLocalGovernment,
			street: selectedStreet,
			postalCode: selectedPostalCode,
		};
		try {
			await updateUserAddress({
				userId,
				address: initialUserData,
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
		<div className="EditAddress">
			<header className="EditAddress_address_title">Address</header>
			<div className="EditAddress_address_wrap">
				<form className="EditAddress_address" onSubmit={handleAdress}>
					{/* Country selection dropdown */}
					<select
						className="EditAddress_address_selections"
						value={selectedCountry}
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
					{selectedCountry !== "Select Country" && (
						<select
							className="EditAddress_address_selections"
							value={selectedState}
							onChange={(e) => {
								setSelectedState(e.target.value);
								setSelectedLocalGovernment("");
								setSelectedStreet("");
								setSelectedPostalCode("");
							}}
						>
							<option value="">Select State</option>
							{countries
								.find((country) => country.name === selectedCountry)
								?.states.map((state) => (
									<option key={state.id} value={state.name}>
										{state.name}
									</option>
								))}
						</select>
					)}
					{/* Local Government selection dropdown */}
					{selectedState && (
						<select
							className="EditAddress_address_selections"
							value={selectedLocalGovernment}
							onChange={(e) => {
								setSelectedLocalGovernment(e.target.value);
								setSelectedStreet("");
								setSelectedPostalCode("");
							}}
						>
							<option value="">Select City</option>
							{countries
								.find((country) => country.name === selectedCountry)
								?.states.find((state) => state.name === selectedState)
								?.localGovernments.map((lg) => (
									<option key={lg.id} value={lg.name}>
										{lg.name}
									</option>
								))}
						</select>
					)}
					{/* Street selection dropdown */}
					{selectedLocalGovernment && (
						<select
							className="EditAddress_address_selections"
							value={selectedStreet}
							onChange={handleStreetChange}
						>
							<option value="">Select Street</option>
							{countries
								.find((country) => country.name === selectedCountry)
								?.states.find((state) => state.name === selectedState)
								?.localGovernments.find(
									(lg) => lg.name === selectedLocalGovernment
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
				{/* Display selected details */}
				<div className="EditAddress_selected_detail">
					<div className="EditAddress_selection_details">
						<p className="EditAddress_selected_details_key">Country:</p>
						<p className="EditAddress_selected_details_value">
							{selectedCountry}
						</p>
					</div>
					<div className="EditAddress_selection_details">
						<p className="EditAddress_selected_details_key">State:</p>
						<p className="EditAddress_selected_details_value">
							{selectedState}
						</p>
					</div>
					<div className="EditAddress_selection_details">
						<p className="EditAddress_selected_details_key">City:</p>
						<p className="EditAddress_selected_details_value">
							{selectedLocalGovernment}
						</p>
					</div>
					<div className="EditAddress_selection_details">
						<p className="EditAddress_selected_details_key">Postal Code:</p>
						<p className="EditAddress_selected_details_value">
							{selectedPostalCode}
						</p>
					</div>
					<div className="EditAddress_selection_details">
						<p className="EditAddress_selected_details_key">Street:</p>
						<p className="EditAddress_selected_details_value">
							{selectedStreet}
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default EditAddress;
