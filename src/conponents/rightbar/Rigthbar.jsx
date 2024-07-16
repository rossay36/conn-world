import "./rightbar.css";
import ProfileRightbar from "./ProfileRightbar";
import HomeRightbar from "./HomeRightbar";
import { useGetUsersQuery } from "../../features/profile/usersApiSlice";

const Rigthbar = ({ friendId, userId, scrollToPictures }) => {
	const {
		data: users,
		isSuccess,
		isLoading,
		isError,
		error,
	} = useGetUsersQuery("usersList", {
		pollingInterval: 15000,
		refetchOnFocus: true,
		refetchOnMountOrArgChange: true,
	});

	if (isLoading) <p>Loading...</p>;

	if (isError) {
		<p className="errmsg">{error?.data?.message}</p>;
	}
	if (isSuccess) {
		const { ids } = users;
	}
	return (
		<div className="rightbar">
			<div className="rightbarWrapper">
				{friendId ? (
					<ProfileRightbar
						userId={userId}
						friendId={friendId}
						scrollToPictures={scrollToPictures}
					/>
				) : (
					<HomeRightbar userId={userId} />
				)}
			</div>
		</div>
	);
};

export default Rigthbar;
