// src/components/ScrollRestoration.js

import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { saveScrollPosition } from "../features/auth/scrollSlice";

const ScrollRestoration = ({ children }) => {
	const location = useLocation();
	const dispatch = useDispatch();
	const scrollPositions = useSelector((state) => state.scroll || {});

	useEffect(() => {
		const path = location.pathname;
		const savedScrollY = scrollPositions[path] || 0;

		console.log(`Restoring scroll position for ${path}: ${savedScrollY}`);
		window.scrollTo(0, savedScrollY);

		return () => {
			const currentScrollY = window.scrollY;
			console.log(`Saving scroll position for ${path}: ${currentScrollY}`);
			dispatch(saveScrollPosition({ path, position: currentScrollY }));
		};
	}, [location, dispatch, scrollPositions]);

	return <>{children}</>;
};

export default ScrollRestoration;
