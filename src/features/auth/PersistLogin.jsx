import { Outlet, Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

import { useSelector } from "react-redux";
import ClipLoader from "react-spinners/ClipLoader";
import usePersist from "../../hooks/usePersist";
import { useRefreshMutation } from "./authApiSlice";
import { selectCurrentToken } from "./authSlice";

const PersistLogin = () => {
	const [persist] = usePersist();
	const token = useSelector(selectCurrentToken);
	const effectRan = useRef(false);

	const [trueSuccess, setTrueSuccess] = useState(false);

	const [refresh, { isUninitialized, isLoading, isSuccess, isError, error }] =
		useRefreshMutation();

	const verifyFunction = async () => {
		const verifyRefreshToken = async () => {
			console.log("verifying refresh token");
			try {
				//const response =
				await refresh();
				//const { accessToken } = response.data
				setTrueSuccess(true);
			} catch (err) {
				console.error(err);
			}
		};

		if (!token && persist === true) return await verifyRefreshToken();
	};

	useEffect(() => {
		if (
			effectRan.current === true ||
			import.meta.env.NODE_ENV !== "development"
		) {
			// React 18 Strict Mode
			verifyFunction();
		}

		return () => (effectRan.current = true);

		// eslint-disable-next-line
	}, []);

	let content;
	if (!persist) {
		// persist: no
		console.log("no persist");
		content = <Outlet />;
	} else if (isLoading) {
		//persist: yes, token: no
		console.log("loading");
		content = <ClipLoader color={"#FFF"} />;
	} else if (isError) {
		//persist: yes, token: no
		console.log("error");
		content = (
			<p className="errmsg">
				{`${error?.data?.message} - `}
				<Link to="/login">Please login again</Link>.
			</p>
		);
	} else if (isSuccess && trueSuccess) {
		//persist: yes, token: yes
		console.log("success");
		content = <Outlet />;
	} else if (token && isUninitialized) {
		//persist: yes, token: yes
		console.log("token and uninit");
		console.log(isUninitialized);
		content = <Outlet />;
	}

	return content;
};
export default PersistLogin;
