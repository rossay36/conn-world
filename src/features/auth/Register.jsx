import { FaRegSave } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useAddNewUserMutation } from "./authApiSlice";
import { ClipLoader } from "react-spinners";

const Register = () => {
	const [addNewUser, { isLoading }] = useAddNewUserMutation();

	const userRef = useRef();
	const errRef = useRef();
	const [firstname, setFirstname] = useState("");
	const [lastname, setLastname] = useState("");
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [errMsg, setErrMsg] = useState("");
	const [passwordsMatch, setPasswordsMatch] = useState(true);

	const navigate = useNavigate();
	const dispatch = useDispatch();

	useEffect(() => {
		userRef?.current?.focus();
	}, []);

	useEffect(() => {
		setErrMsg("");
	}, [
		username,
		password,
		firstname,
		lastname,
		email,
		password,
		confirmPassword,
	]);

	const handleRegister = async (e) => {
		e.preventDefault();
		if (password !== confirmPassword) {
			setPasswordsMatch(false);
			return; // Exit early if passwords don't match
		}

		// Reset the passwords match state if they were previously false
		setPasswordsMatch(true);
		try {
			await addNewUser({
				username,
				password,
				firstname,
				lastname,
				email,
				confirmPassword,
			}).unwrap();
			setFirstname("");
			setLastname("");
			setUsername("");
			setEmail("");
			setConfirmPassword("");
			setPassword("");
			navigate("/login");
		} catch (err) {
			if (!err.status) {
				setErrMsg("No Server Response");
			} else if (err.status === 409) {
				setErrMsg(
					"conflit Username or Email has been taken, login if you have an account"
				);
			} else if (err.status === 400) {
				setErrMsg("Invalid user data received");
			} else {
				setErrMsg(err.data?.message);
			}
			errRef?.current?.focus();
		}
	};

	const errClass = errMsg ? "errmsg" : "offscreen";

	if (isLoading) return <ClipLoader color={"#FFF"} />;

	return (
		<section className="register">
			<div className="form__title-row">
				<h2>User Register</h2>
				<div className="forn_title_save">
					<h2>Conn-</h2>
					<h2>World</h2>
				</div>
			</div>
			{passwordsMatch ? null : (
				<p className="error-message">Passwords do not match.</p>
			)}
			<form className="form" onSubmit={handleRegister}>
				<p ref={errRef} className={errClass} aria-live="assertive">
					{errMsg}
				</p>
				<input
					className="form__input"
					id="firstname"
					name="firstname"
					type="text"
					placeholder="FirstName"
					required
					autoComplete="off"
					value={firstname}
					onChange={(e) => setFirstname(e.target.value)}
					ref={userRef}
				/>

				<input
					className="form__input"
					id="lastname"
					name="lastname"
					type="text"
					placeholder="LastName"
					required
					autoComplete="off"
					value={lastname}
					onChange={(e) => setLastname(e.target.value)}
				/>

				<input
					className="form__input"
					id="username"
					name="username"
					type="text"
					placeholder="Username"
					required
					autoComplete="off"
					value={username}
					onChange={(e) => setUsername(e.target.value)}
				/>

				<input
					className="form__input"
					id="email"
					name="email"
					type="email"
					placeholder="example@gmail.com"
					required
					autoComplete="off"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
				/>

				<input
					className="form__input "
					id="password"
					name="password"
					type="password"
					minLength={4}
					placeholder="Password"
					required
					value={password}
					onChange={(e) => setPassword(e.target.value)}
				/>
				<input
					className="form__input "
					id="Confirmpassword"
					name="Confirmpassword"
					type="password"
					minLength={4}
					placeholder="Confirm Password"
					required
					value={confirmPassword}
					onChange={(e) => setConfirmPassword(e.target.value)}
				/>
				<button className="form__submit-button">
					Save <FaRegSave className="green" />
				</button>
			</form>
			<div className="register_btn">
				<Link className="register_link blue" to="/login">
					Already have an account / Login
				</Link>
			</div>
			<footer className="register_footer">
				<Link to="/">Back to Home</Link>
			</footer>
		</section>
	);
};

export default Register;
