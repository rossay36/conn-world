import React, { useEffect, useState } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";
import { IoCallOutline } from "react-icons/io5";
import { MdOutlineDone, MdOutlineVideocam } from "react-icons/md";
import Conversation from "./Conversation";
import {
	useEditMessageMutation,
	useGetMessagesQuery,
	useSendMessageMutation,
} from "./messageApi";
import useAuth from "../../hooks/useAuth";
import { useGetUsersQuery } from "../profile/usersApiSlice";
import { LuSendHorizonal } from "react-icons/lu";
import io from "socket.io-client"; // Import socket.io-client
import { useSelector } from "react-redux";
import { selectCurrentToken } from "../auth/authSlice";
import { IoIosArrowBack } from "react-icons/io";

const IMG_URL = import.meta.env.VITE_PUBLIC_FOLDER;

const SOCKET_SERVER_URL = "http://localhost:3500";

const MessangerRightbar = ({ onClick, recipientId, isChatActive }) => {
	const [messageText, setMessageText] = useState("");
	const [messageIds, setMessageIds] = useState(null);
	const [toggleEdit, setToggleEdit] = useState(false);
	const [messageEdit, setMessageEdit] = useState("");
	const [socket, setSocket] = useState(null);

	const token = useSelector(selectCurrentToken); // Get token from Redux
	const { userId } = useAuth();
	const {
		data: messages = [],
		isSuccess,
		isLoading,
		isError,
		error,
	} = useGetMessagesQuery("" || recipientId, {
		skip: !recipientId, // Skip fetching if recipientId is not present
		pollingInterval: isChatActive ? 5000 : 0,
		refetchOnFocus: true,
		refetchOnMountOrArgChange: true,
	});

	useEffect(() => {
		if (token) {
			const socketInstance = io(SOCKET_SERVER_URL, {
				query: { token: token },
			});

			socketInstance.on("connect", () => {
				console.log("WebSocket connected");
			});

			socketInstance.on("message", (message) => {
				// Handle incoming messages
				console.log("Message received:", message);
			});

			socketInstance.on("disconnect", () => {
				console.log("WebSocket disconnected");
			});

			setSocket(socketInstance);

			return () => {
				socketInstance.disconnect();
			};
		}
	}, [token, userId]);

	const { currentFriend } = useGetUsersQuery("usersList", {
		selectFromResult: ({ data }) => ({
			currentFriend: data?.entities[recipientId],
		}),
	});

	const [sendMessage, { isError: sendIsError }] = useSendMessageMutation();
	const [editMessage, { isError: editIsError }] = useEditMessageMutation();

	if (isLoading) return <p>Loading...</p>;
	if (isError)
		return (
			<div className="conversation_open">
				<p className="conversation_open_text">No Open Conversation </p>
			</div>
		);

	const handleSendMessage = async (e) => {
		e.preventDefault();
		if (!messageText.trim()) return;

		try {
			const messageData = {
				recipient: recipientId,
				text: messageText,
			};
			await sendMessage(messageData).unwrap();
			if (socket) {
				socket.emit("sendMessage", messageData); // Emit message to WebSocket server
			}
			setMessageText("");
		} catch (err) {
			console.error("Error sending message:", err);
			// Optionally set error state or display a user-friendly message
		}
	};
	const handleEditMessage = async (e) => {
		e.preventDefault();
		if (!messageEdit.trim()) return;

		try {
			const messageData = {
				messageId: messageIds?._id,
				newText: messageEdit,
			};
			await editMessage(messageData).unwrap();
			setMessageEdit("");
			console.log("submited");
			setToggleEdit(false);
		} catch (err) {
			console.log(err);
		}
	};

	return (
		<div className="MessangerRightbar">
			<div className="MessangerRightbar_header_top">
				<div className="MessangerRightbar_header_btn">
					<button className="back_button" onClick={onClick}>
						<IoIosArrowBack />
					</button>
				</div>
				<header className="MessangerRightbar_header">
					<div className="MessangerRightbar_header_user_container">
						<img
							className="MessangerRightbar_header_user_img"
							src={
								currentFriend?.profilePicture
									? currentFriend?.profilePicture
									: IMG_URL + "avatar2.png"
							}
							alt=""
						/>
						<p className="MessangerRightbar_header_user_name">
							{currentFriend?.lastname} {currentFriend?.firstname}
						</p>
					</div>
					<div className="MessangerRightbar_header_icon_container">
						<div className="MessangerRightbar_header_icon">
							<IoCallOutline className="MessangerRightbar_header_icons" />
						</div>
						<div className="MessangerRightbar_header_icon">
							<MdOutlineVideocam className="MessangerRightbar_header_iconV" />
						</div>
						<div className="MessangerRightbar_header_icon">
							<FaSearch className="MessangerRightbar_header_icons" />
						</div>
					</div>
				</header>
			</div>

			{recipientId && (
				<>
					<div className="conversation_wrapper">
						<div className="conversation_wrapper_encrpt">
							<span className="conversation_wrapper_text">
								Note: Your messages are end-to-end encrypted. This means
								Conn-World cannot see your chats, videos, or photos that you
								share with your friends and family. Only you and your recipient
								can view your messages.
							</span>
						</div>
						{/* Check if there are no messages */}
						{isSuccess && messages.ids.length === 0 && (
							<header className="conversation_message">
								<p className="conversation_message_text">
									You don't have any current messages.
								</p>
							</header>
						)}
						{/* Map over messages and pass them to Conversation component */}
						{isSuccess &&
							messages?.ids?.map((messageId) => (
								<Conversation
									key={messageId}
									messageId={messageId}
									recipientId={recipientId}
									toggleEdit={toggleEdit}
									setToggleEdit={setToggleEdit}
									setMessageIds={setMessageIds}
									messages={messages}
								/>
							))}
					</div>
					<form className="conversation_form" onSubmit={handleSendMessage}>
						{toggleEdit ? (
							<input
								className="conversation_form_input"
								placeholder="Chat"
								value={messageEdit}
								onChange={(e) => setMessageEdit(e.target.value)}
							/>
						) : (
							<input
								className="conversation_form_input"
								placeholder="Chat"
								value={messageText}
								onChange={(e) => setMessageText(e.target.value)}
							/>
						)}
						{toggleEdit ? (
							<div className="con_edit_btn_container">
								<button className="conversation_form_btn">
									<FaTimes onClick={() => setToggleEdit(false)} />
								</button>
								<button
									className="conversation_form_btn"
									onClick={handleEditMessage}
								>
									<MdOutlineDone />
								</button>
							</div>
						) : (
							<button className="conversation_form_btn">
								<LuSendHorizonal />
							</button>
						)}
					</form>
				</>
			)}
		</div>
	);
};

export default MessangerRightbar;
