import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const countriesApi = createApi({
	reducerPath: "countriesApi",
	baseQuery: fetchBaseQuery({ baseUrl: "https://restcountries.com/v3/" }),
	endpoints: (builder) => ({
		getCountries: {
			query: () => "all",
		},
	}),
});

export const { useGetCountriesQuery } = countriesApi;
export default countriesApi;
