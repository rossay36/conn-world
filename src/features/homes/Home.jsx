import "./home.css";
import Leftbar from "../../conponents/leftbar/Leftbar";
import Feed from "../../conponents/feeds/Feed";
import Rigthbar from "../../conponents/rightbar/Rigthbar";
import { useSelector } from "react-redux";
import { selectShowfriendsOrFeedComponent } from "../auth/authSlice";
import Users from "./users/Users";
// import { useGetUsersQuery } from "../profile/usersApiSlice";

const Homes = () => {
	const showfriendsOrFeedComponent = useSelector(
		selectShowfriendsOrFeedComponent
	);
	return (
		<div className="home">
			<div className="home_wrap">
				<div className="home_left">
					<Leftbar />
				</div>
				<div className="home_feed">
					{showfriendsOrFeedComponent ? (
						<div className="userFriend_requests_column">
							<Users />
						</div>
					) : (
						<Feed />
					)}
				</div>
				<div className="home_right">
					<Rigthbar />
				</div>
			</div>
		</div>
	);
};

export default Homes;
