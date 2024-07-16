import { useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";
import { selectCurrentToken } from "../features/auth/authSlice";

const useAuth = () => {
	const token = useSelector(selectCurrentToken);
	let isManager = false;
	let isAdmin = false;
	let status = "User";

	if (token) {
		try {
			const decoded = jwtDecode(token);
			if (decoded?.UserInfo) {
				const { username, roles, userId } = decoded?.UserInfo;
				isManager = roles?.includes("Manager");
				isAdmin = roles?.includes("Admin");

				if (isManager) status = "Manager";
				if (isAdmin) status = "Admin";

				return { username, roles, status, isManager, isAdmin, userId };
			}
		} catch (err) {
			console.error("Error decoding token:", err);
		}
	}

	return { username: "", roles: [], isManager, isAdmin, status };
};
export default useAuth;
