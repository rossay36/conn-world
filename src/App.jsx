import { Routes, Route, useNavigate } from "react-router-dom";
import Layout from "./conponents/Layout";
import Public from "./conponents/Public";
import Login from "./features/auth/Login";
import Register from "./features/auth/Register";
import Home from "./features/homes/Home";
import HomeLayout from "./conponents/HomeLayout";
import MissingPage from "./features/missing/MissingPage";
import Profile from "./features/profile/Profile";
import Prefetch from "./features/auth/Prefetch";
import PersistLogin from "./features/auth/PersistLogin";
import { ROLES } from "./config/roles";

const App = () => {
	return (
		<Routes>
			<Route path="/" element={<Layout />}>
				{/* Beginning of Layout */}
				<Route index element={<Public />} />
				<Route path="register" element={<Register />} />
				<Route path="login" element={<Login />} />
				<Route element={<PersistLogin />}>
					<Route element={<Prefetch />}>
						<Route path="home" element={<HomeLayout />}>
							{/* Beginning of HomeLayout */}
							<Route index element={<Home />} />
							<Route path=":userId" element={<Profile />} />

							{/* End of Profile Route */}
						</Route>
						{/* End of HomeLayout */}
					</Route>
				</Route>
				{/* End of PersistLogin */}
			</Route>
			{/* End of Layout */}
			<Route path="*" element={<MissingPage />} />
		</Routes>
	);
};
export default App;
