import { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import { useGetUsersQuery } from "../profile/usersApiSlice";
import "./Messanger.css";
import MessangerLeftbar from "./MessangerLeftbar";
import MessangerRightbar from "./MessangerRightbar";
import { useNavigate, useParams } from "react-router-dom";
const IMG_URL = import.meta.env.VITE_PUBLIC_FOLDER;

const Messanger = () => {
	const { userId } = useAuth();
	const [selectedFriendId, setSelectedFriendId] = useState(null);
	const [isChatActive, setIsChatActive] = useState(false);
	const [isSidebarVisible, setIsSidebarVisible] = useState(true);

	const { currentUser } = useGetUsersQuery("usersList", {
		selectFromResult: ({ data }) => ({
			currentUser: data?.entities[userId],
		}),
	});

	const navigate = useNavigate();
	const { recipientId } = useParams(); // Get recipientId from URL params

	useEffect(() => {
		// Initialize selectedFriendId based on URL
		if (recipientId) {
			setSelectedFriendId(recipientId);
			setIsChatActive(true);
		}
	}, [recipientId]);

	const handleFriendClick = (friendId) => {
		setSelectedFriendId(friendId);
		setIsChatActive(true);
		navigate(`/home/messanger/${friendId}`);
		setIsSidebarVisible(false); // Hide left bar when a friend is selected
	};

	const handleBackToFriends = () => {
		setSelectedFriendId(null);
		setIsChatActive(false);
		setIsSidebarVisible(true); // Show left bar again
		navigate("/home/messanger");
	};

	return (
		<>
			<div className="messanger">
				<div className="messanger_wrapper">
					<div className="messanger_leftbar">
						<article className="messangerLeftbar">
							<header className="messangerLeftbar_header">
								<div className="messangerLeftbar_header_image">
									<img
										className="messangerLeftbar_header_img"
										src={
											currentUser?.profilePicture
												? currentUser?.profilePicture
												: IMG_URL + "avatar2.png"
										}
										alt=""
									/>
									<p className="messangerLeftbar_username">
										{currentUser?.username}
									</p>
								</div>
								<h1 className="messangerLeftbar_chat">Chats</h1>
							</header>
							<form className="messangerLeftbar_form_container">
								<input
									className="messangerLeftbar_input"
									placeholder="Search or start a new chat"
								/>
							</form>
							<ul className="messangerLeftbar_lists_scroll">
								{currentUser?.friends.map((recipientId) => (
									<MessangerLeftbar
										key={recipientId}
										recipientId={recipientId}
										onClick={() => handleFriendClick(recipientId)}
									/>
								))}
							</ul>
						</article>
					</div>
					<div className="messanger_rightbar">
						<MessangerRightbar
							recipientId={selectedFriendId}
							isChatActive={isChatActive}
						/>
					</div>
				</div>
			</div>
			<div className="messanger_media_queries">
				<div className="messanger_wrapper">
					{isSidebarVisible && (
						<div className="messanger_leftbar">
							<article className="messangerLeftbar">
								<header className="messangerLeftbar_header">
									<div className="messangerLeftbar_header_image">
										<img
											className="messangerLeftbar_header_img"
											src={
												currentUser?.profilePicture
													? currentUser?.profilePicture
													: IMG_URL + "avatar2.png"
											}
											alt=""
										/>
										<p className="messangerLeftbar_username">
											{currentUser?.username}
										</p>
									</div>
									<h1 className="messangerLeftbar_chat">Chats</h1>
								</header>
								<form className="messangerLeftbar_form_container">
									<input
										className="messangerLeftbar_input"
										placeholder="Search or start a new chat"
									/>
								</form>
								<ul className="messangerLeftbar_lists_scroll">
									{currentUser?.friends.map((recipientId) => (
										<MessangerLeftbar
											key={recipientId}
											recipientId={recipientId}
											onClick={() => handleFriendClick(recipientId)}
										/>
									))}
								</ul>
							</article>
						</div>
					)}
					{!isSidebarVisible && (
						<div className="messanger_rightbar">
							<MessangerRightbar
								onClick={handleBackToFriends}
								recipientId={selectedFriendId}
								isChatActive={isChatActive}
							/>
						</div>
					)}
				</div>
			</div>
		</>
	);
};

export default Messanger;
