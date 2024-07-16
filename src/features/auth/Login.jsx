import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { setCredentials } from "./authSlice";
import ClipLoader from "react-spinners/ClipLoader";
import { useLoginMutation } from "./authApiSlice";
import usePersist from "../../hooks/usePersist";

const Login = () => {
	const userRef = useRef();
	const errRef = useRef();
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [errMsg, setErrMsg] = useState("");
	const [persist, setPersist] = usePersist();
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const [login, { isLoading }] = useLoginMutation();

	useEffect(() => {
		userRef.current.focus();
	}, []);

	useEffect(() => {
		setErrMsg("");
	}, [username, password]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const { accessToken } = await login({ username, password }).unwrap();
			dispatch(setCredentials({ accessToken }));
			setUsername("");
			setPassword("");
			navigate("/home");
		} catch (err) {
			if (!err.status) {
				setErrMsg("No Server Response");
			} else if (err.status === 400) {
				setErrMsg("Missing Username or Password");
			} else if (err.status === 401) {
				setErrMsg("Unauthorized");
			} else {
				setErrMsg(err.data?.message);
			}
			errRef?.current?.focus();
		}
	};

	const handleUserInput = (e) => setUsername(e.target.value);
	const handlePwdInput = (e) => setPassword(e.target.value);
	const handleToggle = () => setPersist((prev) => !prev);

	const errClass = errMsg ? "errmsg" : "offscreen";

	if (isLoading) return <ClipLoader color={"#FFF"} />;

	return (
		<section className="public">
			<header>
				<h1>User Login</h1>
			</header>
			<main className="login">
				<p ref={errRef} className={errClass} aria-live="assertive">
					{errMsg}
				</p>
				<form className="form" onSubmit={handleSubmit}>
					<label htmlFor="username">Username:</label>
					<input
						className="form__input"
						type="text"
						id="username"
						ref={userRef}
						value={username}
						onChange={handleUserInput}
						autoComplete="off"
						required
					/>

					<label htmlFor="password">Password:</label>
					<input
						className="form__input"
						type="password"
						id="password"
						onChange={handlePwdInput}
						value={password}
						required
					/>
					<button className="form__submit-button">Sign In</button>
					<label htmlFor="persist" className="form__persist">
						<input
							type="checkbox"
							className="form__checkbox"
							id="persist"
							onChange={handleToggle}
							checked={persist}
						/>
						Trust This Device
					</label>
				</form>
				<div className="register_btn">
					<Link className="register_link " to="/register">
						Don't an have account / Sign up
					</Link>
				</div>
			</main>
			<footer>
				<Link to="/">Back to Home</Link>
			</footer>
		</section>
	);
};

export default Login;
