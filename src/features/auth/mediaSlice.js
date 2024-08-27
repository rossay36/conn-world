import { createSlice } from "@reduxjs/toolkit";

const mediaSlice = createSlice({
	name: "media",
	initialState: {
		mediaUrl: null,
		mediaType: null, // 'image' or 'video'
		isOpen: false,
		nextVideoUrl: null,
	},
	reducers: {
		openMediaViewer(state, action) {
			const { url, type, nextVideoUrl } = action.payload;
			state.mediaUrl = url;
			state.mediaType = type;
			state.isOpen = true;
			state.nextVideoUrl = nextVideoUrl || null;
		},
		closeMediaViewer(state) {
			state.isOpen = false;
			state.mediaUrl = null;
			state.mediaType = null;
			state.nextVideoUrl = null;
		},
	},
});

export const { openMediaViewer, closeMediaViewer } = mediaSlice.actions;
export default mediaSlice.reducer;

export const selectMedia = (state) => state.media;
