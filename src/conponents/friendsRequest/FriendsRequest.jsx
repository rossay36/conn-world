import React from "react";
import "./FriendsRequest.css";
import { Link, useParams } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { useGetUsersQuery } from "../../features/profile/usersApiSlice";
import useFriendRequest from "../../hooks/useFriedRequest";
import { useSelector } from "react-redux";
import { selectShowfriendsOrFeedComponent } from "../../features/auth/authSlice";
// const IMG_URL = import.meta.env.VITE_PUBLIC_FOLDER;

const FriendsRequest = ({ friendId }) => {
	const { userId: paramsId } = useParams();
	const { userId } = useAuth();

	const showfriendsOrFeedComponent = useSelector(
		selectShowfriendsOrFeedComponent
	);

	const { currentUser } = useGetUsersQuery("usersList", {
		selectFromResult: ({ data }) => ({
			currentUser: data?.entities[userId],
		}),
	});

	const { friendUsers, isLoading, isError } = useGetUsersQuery("usersList", {
		selectFromResult: ({ data }) => ({
			friendUsers: data?.entities[friendId],
		}),
	});

	if (isLoading) {
		return <RingLoader size={20} margin="auto" color="#000" />; // Show loading indicator
	}

	if (isError || !friendUsers) {
		return <p>Error loading friend details</p>; // Show error message or handle accordingly
	}

	const { sendFriendshipButtons } = useFriendRequest(userId, friendId);

	return (
		<ul
			className={
				showfriendsOrFeedComponent
					? "friend_request_container"
					: "friend_request_container_toggle"
			}
		>
			{currentUser?.friendReceiver?.includes(friendUsers?._id) ||
			userId === friendUsers?._id ? null : (
				<div className="friend_request_wrapper">
					<p className="friend_request_username">
						<span className="friend_request_username_name">
							{friendUsers?.username}
						</span>
					</p>
					<li className="friend_request_lists">
						<Link
							to={`/home/${friendUsers?._id}`}
							className="friend_request_image"
						>
							<img
								className="friend_request_img"
								src={
									friendUsers?.profilePicture
										? friendUsers?.profilePicture
										: "/images/avatar2.png"
								}
								alt=""
							/>
							<div className="friend_request_names">
								<p className="friend_request_name">{friendUsers?.firstname}</p>
								<p className="friend_request_name">{friendUsers?.lastname}</p>
							</div>
						</Link>
						<div className="friend_request_btn">{sendFriendshipButtons()}</div>
					</li>
					<li className="friend_request_lists_bottom">
						<hr className="friend_request_bottom_hr"></hr>
						<div className="friend_request_bottom_list">
							<p className="friend_request_bottom_text">
								<span className="friend_request_bottom_keys">From:</span>
								<span className="friend_request_bottom_value">
									{friendUsers?.address?.country},
								</span>
							</p>
							<p className="friend_request_bottom_text">
								<span className="friend_request_bottom_keys">State:</span>

								<span className="friend_request_bottom_value">
									{friendUsers?.address?.state},
								</span>
							</p>
							<p className="friend_request_bottom_text">
								<span className="friend_request_bottom_keys">City:</span>

								<span className="friend_request_bottom_value">
									{friendUsers?.address?.city}
								</span>
							</p>
						</div>
						<hr className="friend_request_bottom_hr"></hr>
						<div className="friend_request_bottom_list">
							<p className="friend_request_bottom_text">
								<span className="friend_request_bottom_keys">
									Currently Lives In:
								</span>
								<span className="friend_request_bottom_value">
									{friendUsers?.lives?.currentCountry},
								</span>
							</p>
							<p className="friend_request_bottom_text">
								<span className="friend_request_bottom_keys">State</span>

								<span className="friend_request_bottom_value">
									{friendUsers?.lives?.currentState},
								</span>
							</p>
							<p className="friend_request_bottom_text">
								<span className="friend_request_bottom_keys">City:</span>

								<span className="friend_request_bottom_value">
									{friendUsers?.lives?.currentCity}
								</span>
							</p>
						</div>
						<hr className="friend_request_bottom_hr"></hr>
						<div className="friend_request_bottom_list">
							<p className="friend_request_bottom_text">
								<span className="friend_request_bottom_keys">Works At:</span>
								<span className="friend_request_bottom_value">
									{friendUsers?.workAt}
								</span>
							</p>
							<p className="friend_request_bottom_text">
								<span className="friend_request_bottom_keys"> Position:</span>

								<span className="friend_request_bottom_value">
									{friendUsers?.job}.
								</span>
							</p>
						</div>
					</li>
				</div>
			)}
		</ul>
	);
};

export default FriendsRequest;
