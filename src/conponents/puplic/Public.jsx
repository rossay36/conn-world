import { Link } from "react-router-dom";
import "./Public.css";

const Public = () => {
	return (
		<section className="public">
			<header className="public_header">
				<h1 className="public_title">
					Welcome to <span className="nowrap">CONN-WORLD</span>
				</h1>
			</header>
			<main className="public__main">
				<p className="public_text">
					Connect with Friends and Families, CONN-WORLD makes your world so easy
					and fun, Enjoy your world.
				</p>
				<address className="public__addr">
					<h3 className="public_addr_text">
						Connect Your world, Let's Be Happy, Let's Enjoy Together
					</h3>
				</address>
				<br />
				<p className="public_owner">Owner: Obi Ross</p>
			</main>
			<footer className="public_footer">
				<Link className="public_footer_Link" to="/login">
					Login
				</Link>
				<Link className="public_footer_Link" to="/register">
					Sign up
				</Link>
			</footer>
		</section>
	);
};
export default Public;
