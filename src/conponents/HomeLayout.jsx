import { Outlet } from "react-router-dom";
import Navbar from "./navbar/Navbar";
import Footer from "./footer/Footer";

const HomeLayout = () => {
	return (
		<>
			<Navbar />
			<div className="dash-container">
				<Outlet />
			</div>
			<Footer />
		</>
	);
};
export default HomeLayout;
