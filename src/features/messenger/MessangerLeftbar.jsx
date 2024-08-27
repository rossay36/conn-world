import React from "react";
import { useGetUsersQuery } from "../profile/usersApiSlice";
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
// const IMG_URL = import.meta.env.VITE_PUBLIC_FOLDER;

const MessangerLeftbar = ({ recipientId, onClick }) => {
	const { userId } = useAuth();
	const navigate = useNavigate(); // Initialize useNavigate

	const { friends, isLoading, error } = useGetUsersQuery("usersList", {
		selectFromResult: ({ data }) => ({
			friends: data?.entities[recipientId],
		}),
	});

	const { currentUser } = useGetUsersQuery("usersList", {
		selectFromResult: ({ data }) => ({
			currentUser: data?.entities[userId],
		}),
	});

	return (
		<li className="messangerLeftbar_lists" onClick={onClick}>
			<p className="messangerLeftbar_list_image">
				<img
					className="messangerLeftbar_list_img"
					src={
						friends?.profilePicture
							? friends?.profilePicture
							: "/images/avatar2.png"
					}
					alt=""
				/>
			</p>
			<div className="messangerLeftbar_list">
				<div className="messangerLeftbar_list_item">
					<p className="messangerLeftbar_list_username">
						{friends?.lastname} {friends?.firstname}
					</p>
					<span className="messangerLeftbar_list_date">Yesterday</span>
				</div>
				<div className="messangerLeftbar_list_container">
					<p className="messangerLeftbar_list_text">
						hello am rossay am chatting
					</p>
					<span className="messangerLeftbar_list_length">5</span>
				</div>
			</div>
		</li>
	);
};

export default MessangerLeftbar;
