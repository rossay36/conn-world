import "./home.css";
import Leftbar from "../../conponents/leftbar/Leftbar";
import Feed from "../../conponents/feeds/Feed";
import Rigthbar from "../../conponents/rightbar/Rigthbar";
// import { useGetUsersQuery } from "../profile/usersApiSlice";

const Homes = () => {
	return (
		<div className="home">
			<div className="home_wrap">
				<div className="home_left">
					<Leftbar />
				</div>
				<div className="home_feed">
					<Feed />
				</div>
				<div className="home_right">
					<Rigthbar />
				</div>
			</div>
		</div>
	);
};

export default Homes;
