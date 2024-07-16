import React from "react";
import { useGetUsersQuery } from "../../features/profile/usersApiSlice";
import { Link } from "react-router-dom";
const IMG_URL = import.meta.env.VITE_PUBLIC_FOLDER;

const LikeDropdown = ({ likerId, scrollToPictures }) => {
	const { user } = useGetUsersQuery("postsList", {
		selectFromResult: ({ data }) => ({
			user: data?.entities[likerId],
		}),
	});

	console.log(user);

	return (
		<li key={likerId} className="likeDropdown_list">
			<Link to={`/home/${user?._id}`} onClick={scrollToPictures}>
				<img
					className="likeDropdown_img"
					src={
						user?.profilePicture
							? IMG_URL + user?.profilePicture
							: IMG_URL + "avatar2.png"
					} // Replace with actual avatar URL
					alt=""
				/>
			</Link>
			{/* Display name or username */}
			<span className="likeDropdown_name">{user?.username}</span>
		</li>
	);
};

export default LikeDropdown;
