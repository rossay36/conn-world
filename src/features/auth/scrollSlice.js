// src/features/scroll/scrollSlice.js

import { createSlice } from "@reduxjs/toolkit";
import { saveToLocalStorage, getFromLocalStorage } from "./Storage";

const initialState = getFromLocalStorage("scrollPositions") || {};

const scrollSlice = createSlice({
	name: "scroll",
	initialState,
	reducers: {
		saveScrollPosition: (state, action) => {
			const { path, position } = action.payload;
			state[path] = position;
			saveToLocalStorage("scrollPositions", state); // Save to localStorage
		},
		getScrollPosition: (state, action) => {
			const { path } = action.payload;
			return state[path] || 0;
		},
	},
});

export const { saveScrollPosition, getScrollPosition } = scrollSlice.actions;
export default scrollSlice.reducer;
