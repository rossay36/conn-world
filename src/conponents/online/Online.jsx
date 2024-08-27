import { useGetUsersQuery } from "../../features/profile/usersApiSlice";
import "./Online.css";
// const IMG_URL = import.meta.env.VITE_PUBLIC_FOLDER;

const Online = ({ friendsId }) => {
	const { userFriends, isLoading, isError, error } = useGetUsersQuery(
		"usersList",
		{
			selectFromResult: ({ data }) => ({
				userFriends: data?.entities[friendsId],
			}),
		}
	);
	return (
		<li className="rightbarFriend">
			<div className="rightbarProfileImgContainer">
				<img
					className="rightbarProfileImg"
					src={
						userFriends?.profilePicture
							? userFriends?.profilePicture
							: "/images/avatar2.png"
					}
					alt=""
				/>
				<span className="rightbarOnline"></span>
			</div>
			<span className="rightbarUsername">
				{userFriends?.lastname} {userFriends?.firstname}
			</span>
		</li>
	);
};

export default Online;
