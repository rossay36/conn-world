import useFriendRequest from "../../hooks/useFriedRequest";
import useAuth from "../../hooks/useAuth";
import { Link } from "react-router-dom";
import { useGetUsersQuery } from "../../features/profile/usersApiSlice";
const IMG_URL = import.meta.env.VITE_PUBLIC_FOLDER;

const AcceptFriends = ({ requestId: friendId }) => {
	const { userId } = useAuth();

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

	const { acceptFriendshipButtons, sendFriendshipButtons } = useFriendRequest(
		friendId,
		userId
	);

	console.log("requsters", typeof friendUsers?._id);

	return (
		<ul className="acceptFriends_container">
			<li className="acceptFriends_lists">
				<div className="acceptFriends_top">
					<Link
						to={`/home/${friendUsers?._id}`}
						className="acceptFriends_image"
					>
						<img
							className="acceptFriends_img"
							src={
								friendUsers?.profilePicture
									? IMG_URL + friendUsers?.profilePicture
									: IMG_URL + "/avatar2.png"
							}
							alt=""
						/>
					</Link>
					<div className="acceptFriends_names">
						<p className="acceptFriends_name">{friendUsers?.firstname}</p>
						<p className="acceptFriends_name">{friendUsers?.lastname}</p>
					</div>
				</div>

				<div className="acceptFriends_btn">{acceptFriendshipButtons()}</div>
			</li>
		</ul>
	);
};

export default AcceptFriends;
