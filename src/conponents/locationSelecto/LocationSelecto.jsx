import React, { useState } from "react";
import { useGetCountriesQuery } from "./countriesApiSlice"; // Adjust the import path as per your project structure
import { useGetStatesByCountryIdQuery } from "./statesApiSlice"; // Import the RTK Query hook for states
import { useGetSubdivisionsByStateIdQuery } from "./subdivisionsApiSlice"; // Import the RTK Query hook for subdivisions
import { useGetStreetsBySubdivisionIdQuery } from "./streetsApiSlice"; // Import the RTK Query hook for streets

const LocationSelector = () => {
	const {
		data: countries = [],
		isLoading: countriesLoading,
		isError: countriesError,
	} = useGetCountriesQuery();
	const [selectedCountry, setSelectedCountry] = useState("");
	const {
		data: states = [],
		isLoading: statesLoading,
		isError: statesError,
	} = useGetStatesByCountryIdQuery(selectedCountry);
	const [selectedState, setSelectedState] = useState("");
	const {
		data: subdivisions = [],
		isLoading: subdivisionsLoading,
		isError: subdivisionsError,
	} = useGetSubdivisionsByStateIdQuery(selectedState);
	const [selectedSubdivision, setSelectedSubdivision] = useState("");
	const {
		data: streets = [],
		isLoading: streetsLoading,
		isError: streetsError,
	} = useGetStreetsBySubdivisionIdQuery(selectedSubdivision);

	if (
		countriesLoading ||
		statesLoading ||
		subdivisionsLoading ||
		streetsLoading
	)
		return <p>Loading...</p>;
	if (countriesError || statesError || subdivisionsError || streetsError)
		return <p>Error fetching data.</p>;

	const handleCountrySelect = (countryId) => {
		setSelectedCountry(countryId);
		setSelectedState(""); // Reset state selection when country changes
	};

	const handleStateSelect = (stateId) => {
		setSelectedState(stateId);
		setSelectedSubdivision(""); // Reset subdivision selection when state changes
	};

	const handleSubdivisionSelect = (subdivisionId) => {
		setSelectedSubdivision(subdivisionId);
	};

	return (
		<div>
			<label>Select Country:</label>
			<select
				value={selectedCountry}
				onChange={(e) => handleCountrySelect(e.target.value)}
			>
				<option value="">Select a country</option>
				{countries.map((country) => (
					<option key={country.name} value={country.name}>
						{country.name}
					</option>
				))}
			</select>

			<label>Select State:</label>
			<select
				value={selectedState}
				onChange={(e) => handleStateSelect(e.target.value)}
			>
				<option value="">Select a state</option>
				{states.map((state) => (
					<option key={state.name} value={state.name}>
						{state.name}
					</option>
				))}
			</select>

			<label>Select Subdivision:</label>
			<select
				value={selectedSubdivision}
				onChange={(e) => handleSubdivisionSelect(e.target.value)}
			>
				<option value="">Select a subdivision</option>
				{subdivisions.map((subdivision) => (
					<option key={subdivision.name} value={subdivision.name}>
						{subdivision.name}
					</option>
				))}
			</select>

			<label>Select Street:</label>
			<select>
				<option value="">Select a street</option>
				{streets.map((street) => (
					<option key={street.name} value={street.name}>
						{street.name}
					</option>
				))}
			</select>
		</div>
	);
};

export default LocationSelector;
