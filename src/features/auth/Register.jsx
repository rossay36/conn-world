import { FaRegSave } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useAddNewUserMutation } from "./authApiSlice";
import { ClipLoader } from "react-spinners";
import "./Register.css";

const IMG_URL = import.meta.env.VITE_PUBLIC_FOLDER;

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
	const [gender, setGender] = useState("");
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
		gender,
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
				gender,
			}).unwrap();

			console.log("registered successful...");
			setFirstname("");
			setLastname("");
			setUsername("");
			setEmail("");
			setConfirmPassword("");
			setPassword("");
			setGender("");
			navigate("/login");
		} catch (err) {
			console.error("registered faild...");
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
		<section className="register_section">
			<header className="register_header">
				<h2 className="register_title">Conn-World Register.</h2>
				<h2 className="register_title">Connect Your Wolrd</h2>
			</header>
			<main className="register">
				<div className="register_left_form_container">
					{passwordsMatch ? null : (
						<p className="error-message">Passwords do not match.</p>
					)}
					<form className="register_form" onSubmit={handleRegister}>
						<p ref={errRef} className={errClass} aria-live="assertive">
							{errMsg}
						</p>
						<input
							className="register_form__input"
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
							className="register_form__input"
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
							className="register_form__input"
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
							className="register_form__input"
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
							className="register_form__input "
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
							className="register_form__input "
							id="Confirmpassword"
							name="Confirmpassword"
							type="password"
							minLength={4}
							placeholder="Confirm Password"
							required
							value={confirmPassword}
							onChange={(e) => setConfirmPassword(e.target.value)}
						/>
						<select
							className="register_form__input"
							value={gender}
							onChange={(e) => setGender(e.target.value)}
							required
						>
							<option value="">Select Gender</option>
							<option value="Male">Male</option>
							<option value="Female">Female</option>
							<option value="Non-binary">Non-binary</option>
							<option value="Genderqueer">Genderqueer</option>
							<option value="Genderfluid">Genderfluid</option>
							<option value="Agender">Agender</option>
							<option value="Bigender">Bigender</option>
							<option value="Other">Other</option>
						</select>
						<button className="register_btn">
							Save <FaRegSave className="green" />
						</button>
					</form>
					<div className="register_register_btn">
						<Link className="register_registerer_link" to="/login">
							Already have an account / Login
						</Link>
					</div>
				</div>
				<div className="register_image_container">
					<article className="register_image_text_colunm">
						<h3 className="register_image_text">
							Connect And Chat, Share Photos, Videos Feeling And More, With Your
							Friends And Families Around The World On <span>Conn-World</span>
						</h3>
					</article>
					<img
						src={IMG_URL + "world.png"}
						alt="Login Image"
						className="register_image"
					/>
				</div>
			</main>
			<footer className="register_footer">
				<Link className="register_footer_Link" to="/">
					Back to Home
				</Link>
			</footer>
		</section>
	);
};

export default Register;
