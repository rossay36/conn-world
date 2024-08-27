import React from "react";
import "./profileUserFriends.css";
import useFriendRequest from "../../../hooks/useFriedRequest";
import { RingLoader } from "react-spinners";
import { useGetUsersQuery } from "../usersApiSlice";
import useAuth from "../../../hooks/useAuth";
import { Link } from "react-router-dom";
// const IMG_URL = import.meta.env.VITE_PUBLIC_FOLDER;

const ProfileUserFriends = ({ scrollToPictures, friendIds }) => {
	const { userId } = useAuth();
	const { friendUsers, isLoading, isError } = useGetUsersQuery("usersList", {
		selectFromResult: ({ data }) => ({
			friendUsers: data?.entities[friendIds],
		}),
	});

	if (isLoading) {
		return <RingLoader size={20} margin="auto" color="#000" />; // Show loading indicator
	}

	if (isError || !friendUsers) {
		return <p>Error loading friend details</p>; // Show error message or handle accordingly
	}

	const friendId = friendIds;

	const { sendFriendshipButtons } = useFriendRequest(userId, friendId);
	return (
		<ul className="profileUserFriends_container">
			<div className="profileUserFriends_wrapper">
				<p className="profileUserFriends_username">
					<span className="profileUserFriends_username_name">
						{friendUsers?.username}
					</span>
				</p>
				<li className="profileUserFriends_lists">
					<Link
						to={`/home/${friendUsers?._id}`}
						onClick={scrollToPictures}
						className="profileUserFriends_image"
					>
						<img
							className="profileUserFriends_img"
							src={
								friendUsers?.profilePicture
									? friendUsers?.profilePicture
									: "/images/avatar2.png"
							}
							alt=""
						/>
						<div className="profileUserFriends_names">
							<p className="profileUserFriends_name">
								{friendUsers?.firstname}
							</p>
							<p className="profileUserFriends_name">{friendUsers?.lastname}</p>
						</div>
					</Link>
					<div className="profileUserFriends_btn">
						{sendFriendshipButtons()}
					</div>
				</li>
				<li className="profileUserFriends_lists_bottom">
					<hr className="profileUserFriends_bottom_hr"></hr>
					<div className="profileUserFriends_bottom_list">
						<p className="profileUserFriends_bottom_text">
							<span className="profileUserFriends_bottom_keys">From:</span>
							<span className="profileUserFriends_bottom_value">
								{friendUsers?.address?.country},
							</span>
						</p>
						<p className="profileUserFriends_bottom_text">
							<span className="profileUserFriends_bottom_keys">State:</span>

							<span className="profileUserFriends_bottom_value">
								{friendUsers?.address?.state},
							</span>
						</p>
						<p className="profileUserFriends_bottom_text">
							<span className="profileUserFriends_bottom_keys">City:</span>

							<span className="profileUserFriends_bottom_value">
								{friendUsers?.address?.city}
							</span>
						</p>
					</div>
					<hr className="profileUserFriends_bottom_hr"></hr>
					<div className="profileUserFriends_bottom_list">
						<p className="profileUserFriends_bottom_text">
							<span className="profileUserFriends_bottom_keys">
								Currently Lives In:
							</span>
							<span className="profileUserFriends_bottom_value">
								{friendUsers?.lives?.currentCountry},
							</span>
						</p>
						<p className="profileUserFriends_bottom_text">
							<span className="profileUserFriends_bottom_keys">State</span>

							<span className="profileUserFriends_bottom_value">
								{friendUsers?.lives?.currentState},
							</span>
						</p>
						<p className="profileUserFriends_bottom_text">
							<span className="profileUserFriends_bottom_keys">City:</span>

							<span className="profileUserFriends_bottom_value">
								{friendUsers?.lives?.currentCity}
							</span>
						</p>
					</div>
					<hr className="profileUserFriends_bottom_hr"></hr>
					<div className="profileUserFriends_bottom_list">
						<p className="profileUserFriends_bottom_text">
							<span className="profileUserFriends_bottom_keys">Works At:</span>
							<span className="profileUserFriends_bottom_value">
								{friendUsers?.workAt}
							</span>
						</p>
						<p className="profileUserFriends_bottom_text">
							<span className="profileUserFriends_bottom_keys"> Position:</span>

							<span className="profileUserFriends_bottom_value">
								{friendUsers?.job}.
							</span>
						</p>
					</div>
				</li>
			</div>
		</ul>
	);
};

export default ProfileUserFriends;
