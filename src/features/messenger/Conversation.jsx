import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useGetMessagesQuery } from "./messageApi";
import useAuth from "../../hooks/useAuth";
import { RiArrowDropDownLine } from "react-icons/ri";
import ConverstionOptions from "./ConverstionOptions";
import { format } from "timeago.js";

const Conversation = ({
	messageId,
	toggleEdit,
	setToggleEdit,
	setMessageIds,
	recipientId,
	messages,
}) => {
	const { userId } = useAuth();
	const [conversationActive, setConversationActive] = useState(false);

	const { message } = useGetMessagesQuery("" || recipientId, {
		selectFromResult: ({ data }) => ({
			message: data?.entities[messageId],
		}),
	});

	const latestMessageRef = useRef(null);

	useEffect(() => {
		if (latestMessageRef.current) {
			latestMessageRef.current.scrollIntoView({
				behavior: "smooth",
				block: "end",
			});
		}
	}, [messageId, messages]);

	const handleConversationActive = () => {
		setConversationActive((prev) => !prev);
	};

	return (
		<div
			className={`conversation ${userId === message?.sender?._id ? "own" : ""}`}
			ref={
				messageId === messages?.ids[messages?.ids?.length - 1]
					? latestMessageRef
					: null
			}
		>
			<article className="conversation_items">
				<div className="con_icon_text_container">
					<span className="conversation_text">{message?.text}</span>
					{conversationActive && (
						<div className="converstion_hover_options_wrapper">
							<ConverstionOptions
								toggleEdit={toggleEdit}
								message={message}
								setToggleEdit={setToggleEdit}
								setMessageIds={setMessageIds}
							/>
						</div>
					)}
					<RiArrowDropDownLine
						className="con_dropdown_icon"
						onClick={handleConversationActive}
					/>
				</div>
				<span className="conversation_time">{format(message?.createdAt)}</span>
			</article>
		</div>
	);
};

export default Conversation;
