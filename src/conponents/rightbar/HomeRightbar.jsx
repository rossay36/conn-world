import "./rightbar.css";
import { IoIosGift } from "react-icons/io";
import avatar2 from "../../assets/avatar2.png";
// import Online from "../online/Online";
// import { Users } from "../../Dummy";
import { useGetUsersQuery } from "../../features/profile/usersApiSlice";

const HomeRightbar = ({ userId }) => {
	const { currentUser } = useGetUsersQuery("usersList", {
		selectFromResult: ({ data }) => ({
			currentUser: data?.entities[userId],
		}),
	});

	return (
		<div className="rightbar">
			<div className="birthdayContainer">
				<IoIosGift className="birthdayImg" />
				<span className="birthdayText">
					<b>Pola Foster</b> and <b>3 other friends</b> have a birhday today.
				</span>
			</div>
			<img className="rightbarAd" src={avatar2} alt="image" />
			<h4 className="rightbarTitle">Online Friends</h4>
			{/* <ul className="rightbarFriendList">
				{Users.map((u) => (
					<Online key={u.id} user={u} />
				))}
			</ul> */}
		</div>
	);
};

export default HomeRightbar;
