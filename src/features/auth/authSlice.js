import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
	name: "auth",
	initialState: {
		token: null,
		showComponentA: false,
		showfriendsOrFeedComponent: false,
		showReqest: false,
	},
	reducers: {
		setCredentials: (state, action) => {
			const { accessToken } = action.payload;
			state.token = accessToken;
		},
		logOut: (state) => {
			state.token = null;
			state.showComponentA = false;
			state.showfriendsOrFeedComponent = false;
			state.showReqest = false;
		},
		toggleComponent: (state) => {
			state.showComponentA = !state.showComponentA;
		},
		toggleFrindAndFeedComponent: (state) => {
			state.showfriendsOrFeedComponent = !state.showfriendsOrFeedComponent;
		},
		toggleRequest: (state) => {
			state.showReqest = !state.showReqest;
		},
	},
});

export const {
	setCredentials,
	logOut,
	toggleComponent,
	toggleRequest,
	toggleFrindAndFeedComponent,
} = authSlice.actions;

export default authSlice.reducer;

export const selectCurrentToken = (state) => state.auth.token;
export const selectShowComponentA = (state) => state.auth.showComponentA;
export const selectShowfriendsOrFeedComponent = (state) =>
	state.auth.showfriendsOrFeedComponent;
export const selectshowReqest = (state) => state.auth.showReqest;
