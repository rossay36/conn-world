import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { setCredentials } from "./authSlice";
import ClipLoader from "react-spinners/ClipLoader";
import { useLoginMutation, useRefreshMutation } from "./authApiSlice";
import usePersist from "../../hooks/usePersist";
import "./Login.css";
import { TbWorldHeart } from "react-icons/tb";

// const IMG_URL = import.meta.env.VITE_PUBLIC_FOLDER;

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
	const [refresh, { isLoading: loading }] = useRefreshMutation();

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
		// login_section
		<section className="login_section">
			<header className="login_world_top">
				<h1 className="login_title">Conn-World Login</h1>
				<h1 className="login_title">Connect Your Wolrd</h1>
			</header>
			<main className="login">
				<div className="login_left_form_container">
					<p ref={errRef} className={errClass} aria-live="assertive">
						{errMsg}
					</p>
					<form className="login_form" onSubmit={handleSubmit}>
						<input
							className="login_form__input"
							placeholder="Username"
							type="text"
							id="username"
							ref={userRef}
							value={username}
							onChange={handleUserInput}
							autoComplete="off"
							required
						/>
						<input
							className="login_form__input"
							placeholder="Password"
							type="password"
							id="password"
							onChange={handlePwdInput}
							value={password}
							required
						/>
						<button className="login_btn">Sign In</button>
						<label htmlFor="persist" className="login_form__persist">
							<input
								type="checkbox"
								className="login_form__checkbox"
								id="persist"
								onChange={handleToggle}
								checked={persist}
							/>
							Trust This Device
						</label>
					</form>
					<div className="login_register_btn">
						<Link className="login_register_link " to="/register">
							Don't have an account / Sign up
						</Link>
					</div>
				</div>
				<div className="login_image_container">
					<article className="login_image_text_colunm">
						<h3 className="login_image_text">
							Connect And Chat, Share Photos, Videos Feeling And More, With Your
							Friends And Families Around The World On <span>Conn-World</span>
						</h3>
					</article>
					<img
						src={"/images/world.png"}
						alt="Login Image"
						className="login_image"
					/>
				</div>
			</main>
			<footer className="login_footer">
				<Link className="login_footer_Link" to="/">
					Back to Home
				</Link>
			</footer>
		</section>
	);
};

export default Login;
