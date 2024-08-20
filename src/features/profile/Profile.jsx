import "./Profile.css";
import Leftbar from "../../conponents/leftbar/Leftbar";
import Feed from "../../conponents/feeds/Feed";
import Rigthbar from "../../conponents/rightbar/Rigthbar";
import { useGetUsersQuery } from "./usersApiSlice";
import { useRef, useState } from "react";
import { useParams } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import ProfilePictures from "./ProfilePictures";
import { CurrentUserFriends } from "./CurrentUserFriends";
import ProfileUserFriends from "./profileUserFriends/ProfileUserFriends";
import { GrClose } from "react-icons/gr";

const Profile = () => {
	const { userId } = useAuth();
	const { userId: friendId } = useParams();
	const [photoViewerOpen, setPhotoViewerOpen] = useState(false);
	const [selectedPhoto, setSelectedPhoto] = useState(null);
	const [showAllFriends, setShowAllFriends] = useState(false); // State for showing all friends
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

	const handleShowMoreFriends = () => {
		setShowAllFriends(true); // Show all friends when clicked
	};
	const handleShowMoreFriendsClose = () => {
		setShowAllFriends(false); // Show all friends when clicked
	};

	if (isLoading) {
		return <div>Loading...</div>;
	}

	if (isError) {
		return <div>Error: {error?.message}</div>;
	}

	const friendsToShow = showAllFriends
		? user?.friends
		: user?.friends?.slice(0, 3);

	return (
		<div className="profile">
			<div className="profile_leftabar_wrap">
				<Leftbar />
			</div>
			<div className="profileRight">
				<ProfilePictures
					openPhotoViewer={openPhotoViewer}
					user={user}
					profileSectionRef={profileSectionRef}
				/>
				<div className="profileRightBottom">
					<div
						className="friends_feed_grid"
						style={{ display: "grid", flex: "5.5" }}
					>
						{showAllFriends && (
							<haeder
								className="CurrentUserFriends_container_header"
								onClick={handleShowMoreFriendsClose}
							>
								<button className="CurrentUserFriends_container_btn">
									Close Friend Lists <GrClose />
								</button>
							</haeder>
						)}
						<div className="CurrentUserFriends_container">
							{showAllFriends ? (
								<div className="profileFriends_wrapper">
									{user?.friends?.map((friendIds) => (
										<ProfileUserFriends
											key={friendIds}
											friendIds={friendIds}
											scrollToPictures={scrollToPictures}
										/>
									))}
								</div>
							) : (
								<ul className="CurrentUserFriends">
									{friendsToShow?.length ? (
										friendsToShow.map((fIds) => (
											<CurrentUserFriends
												key={fIds}
												fIds={fIds}
												scrollToPictures={scrollToPictures}
											/>
										))
									) : (
										<p>{user?.username} Has No Friends</p>
									)}
								</ul>
							)}
							{user?.friends?.length > 3 && !showAllFriends && (
								<div className="seeMoreFriendsBtn_container">
									<button
										onClick={handleShowMoreFriends}
										className="seeMoreFriendsBtn"
									>
										See More Friends
									</button>
								</div>
							)}
						</div>
						<Feed
							scrollToPictures={scrollToPictures}
							profilePostId={user?._id}
						/>
					</div>
					<div className="profile_rightbar_wrap">
						<Rigthbar
							friendId={friendId}
							userId={userId}
							scrollToPictures={scrollToPictures}
							openPhotoViewer={openPhotoViewer}
						/>
					</div>
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
