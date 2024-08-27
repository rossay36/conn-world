import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./navbar/Navbar";
import Footer from "./footer/Footer";
import PhotoAndVideoeViewer from "../features/auth/PhotoAndVideoeViewer";

const HomeLayout = () => {
	const location = useLocation();
	const isMessengerPage = location.pathname.includes("messenger");
	return (
		<>
			{!isMessengerPage && <Navbar />}
			<div className="dash-container">
				<Outlet />
			</div>
			{!isMessengerPage && <Footer />}
			<PhotoAndVideoeViewer />
		</>
	);
};
export default HomeLayout;
