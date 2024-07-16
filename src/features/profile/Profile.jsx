import "./Profile.css";
import Leftbar from "../../conponents/leftbar/Leftbar";
import Feed from "../../conponents/feeds/Feed";
import Rigthbar from "../../conponents/rightbar/Rigthbar";
import { useGetUsersQuery } from "./usersApiSlice";
import { useRef, useState } from "react";
import { useParams } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import ProfilePictures from "./ProfilePictures";

const Profile = () => {
	const { userId } = useAuth();
	const { userId: friendId } = useParams();
	const [photoViewerOpen, setPhotoViewerOpen] = useState(false);
	const [selectedPhoto, setSelectedPhoto] = useState(null);
	const profileSectionRef = useRef(null);

	const { user, isLoading, isError, error } = useGetUsersQuery("usersList", {
		selectFromResult: ({ data }) => ({
			user: data?.entities[friendId],
		}),
	});

	const scrollToPictures = () => {
		profileSectionRef.current.scrollIntoView({
			behavior: "smooth",
			block: "start",
		});
	};

	const openPhotoViewer = (imageUrl) => {
		setSelectedPhoto(imageUrl);
		setPhotoViewerOpen(true);
	};

	const closePhotoViewer = () => {
		setSelectedPhoto(null);
		setPhotoViewerOpen(false);
	};

	if (isLoading) {
		return <div>Loading...</div>;
	}

	if (isError) {
		return <div>Error: {error?.message}</div>;
	}

	return (
		<div className="profile">
			<Leftbar />
			<div className="profileRight">
				<ProfilePictures
					openPhotoViewer={openPhotoViewer}
					user={user}
					profileSectionRef={profileSectionRef}
				/>
				<div className="profileRightBottom">
					{/* Pass scrollToPictures function to Feed component */}
					<Feed scrollToPictures={scrollToPictures} profilePostId={user?._id} />
					<Rigthbar
						friendId={friendId}
						userId={userId}
						scrollToPictures={scrollToPictures}
					/>
				</div>
			</div>

			{photoViewerOpen && (
				<div className="photoViewerModal">
					<img
						src={selectedPhoto}
						alt="Expanded Photo"
						className="expandedPhoto"
					/>
					<button onClick={closePhotoViewer} className="closeButton">
						Close
					</button>
				</div>
			)}
		</div>
	);
};

export default Profile;
