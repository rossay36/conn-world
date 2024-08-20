import { Link } from "react-router-dom";
import { useGetUsersQuery } from "../../features/profile/usersApiSlice";
import useAcceptRequest from "../../hooks/useAcceptRequest";
const IMG_URL = import.meta.env.VITE_PUBLIC_FOLDER;

const AcceptFriends = ({ friendId }) => {
	// const { userId } = useAuth();

	const { friendUsers, isLoading, isError, error } = useGetUsersQuery(
		"usersList",
		{
			selectFromResult: ({ data }) => ({
				friendUsers: data?.entities[friendId],
			}),
		}
	);

	if (isLoading) {
		return <RingLoader size={20} margin="auto" color="#000" />; // Show loading indicator
	}

	if (isError || !friendUsers) {
		return <p>{error?.data?.message}</p>; // Show error message or handle accordingly
	}

	const { acceptFriendshipButtons } = useAcceptRequest(friendId);

	return (
		<ul className="acceptFriends_container">
			<p className="acceptFriends_username">
				<span className="acceptFriends_username_name">
					{friendUsers?.username}
				</span>
			</p>
			<li className="acceptFriends_lists">
				<Link to={`/home/${friendUsers?._id}`} className="acceptFriends_image">
					<img
						className="acceptFriends_img"
						src={
							friendUsers?.profilePicture
								? friendUsers?.profilePicture
								: IMG_URL + "/avatar2.png"
						}
						alt=""
					/>
					<div className="acceptFriends_names">
						<p className="acceptFriends_name">{friendUsers?.firstname}</p>
						<p className="acceptFriends_name">{friendUsers?.lastname}</p>
					</div>
				</Link>
				<div className="acceptFriends_btn">{acceptFriendshipButtons()}</div>
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
		</ul>
	);
};

export default AcceptFriends;
