import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
	name: "auth",
	initialState: {
		token: null,
	},
	reducers: {
		setCredentials: (state, action) => {
			const { accessToken } = action.payload;
			state.token = accessToken;
		},
		logOut: (state, action) => {
			state.token = null;
		},
		toggleComponent: (state) => {
			state.showComponentA = !state.showComponentA; // Toggle between true and false
		},
		toggleRequest: (state) => {
			state.showReqest = !state.showReqest; // Toggle between true and false
		},
	},
});

export const { setCredentials, logOut, toggleComponent, toggleRequest } =
	authSlice.actions;

export default authSlice.reducer;

export const selectCurrentToken = (state) => state.auth.token;
export const selectShowComponentA = (state) => state.auth.showComponentA;
export const selectshowReqest = (state) => state.auth.showReqest;
