import React from "react";
import "./UserFriendRequests.css";
import Leftbar from "../../../conponents/leftbar/Leftbar";
import Rigthbar from "../../../conponents/rightbar/Rigthbar";
import Users from "../users/Users";

const UserFriendRequests = () => {
	return (
		<div className="UserFriendRequests">
			<div className="UserFriendRequests_leftbar">
				<Leftbar />
			</div>
			<div className="UserFriendRequests_friend">
				<Users />
			</div>
			<div className="UserFriendRequests_rightbar">
				<Rigthbar />
			</div>
		</div>
	);
};

export default UserFriendRequests;
