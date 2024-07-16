import React from "react";
import { useGetUsersQuery } from "../../features/profile/usersApiSlice";
import { Link } from "react-router-dom";
const IMG_URL = import.meta.env.VITE_PUBLIC_FOLDER;

const AllCurrentUserFriends = ({ user }) => {
	const { friends } = useGetUsersQuery("usersList", {
		selectFromResult: ({ data }) => ({
			friends: data?.entities[user],
		}),
	});

	return (
		<div className="leftbar_friends" key={friends?._id}>
			<Link to={`/home/${friends?._id}`}>
				<img
					className="leftbar_img"
					src={
						friends?.profilePicture
							? IMG_URL + friends?.profilePicture
							: IMG_URL + "/avatar2.png"
					}
					alt=""
				/>
			</Link>
			<div className="leftbar_names">
				<p className="leftbar_name">{friends?.firstname}</p>
				<p className="leftbar_name">{friends?.lastname}</p>
			</div>
		</div>
	);
};

export default AllCurrentUserFriends;
