import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./navbar/Navbar";
import Footer from "./footer/Footer";

const HomeLayout = () => {
	const location = useLocation();
	const isMessengerPage = location.pathname.includes("messanger");
	return (
		<>
			{!isMessengerPage && <Navbar />}
			<div className="dash-container">
				<Outlet />
			</div>
			{!isMessengerPage && <Footer />}
		</>
	);
};
export default HomeLayout;
