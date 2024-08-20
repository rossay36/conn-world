import React from "react";
import { FaRegShareSquare } from "react-icons/fa";
import {
	MdContentCopy,
	MdInfoOutline,
	MdOutlineReply,
	MdOutlineReportGmailerrorred,
} from "react-icons/md";
import { RiDeleteBinLine } from "react-icons/ri";
import { TiEdit } from "react-icons/ti";

const ConverstionOptions = ({
	toggleEdit,
	message,
	setToggleEdit,
	setMessageIds,
}) => {
	const handleEditText = () => {
		setToggleEdit((prev) => !prev);
		setMessageIds(message);
	};

	return (
		<ul className="converstion_hover_options">
			<li className="con_hover_reply">
				<MdOutlineReply className="con_hover_reply_icon" />
				<span className="con_hover_reply_text">Reply</span>
			</li>
			<li className="con_hover_reply">
				<FaRegShareSquare className="con_hover_reply_icon" />
				<span className="con_hover_reply_text">Share</span>
			</li>
			<li className="con_hover_reply">
				<MdOutlineReportGmailerrorred className="con_hover_reply_icon" />
				<span className="con_hover_reply_text">Forward</span>
			</li>
			<li className="con_hover_reply">
				<MdContentCopy className="con_hover_reply_icon" />
				<span className="con_hover_reply_text">Copy</span>
			</li>
			<li className="con_hover_reply">
				<TiEdit className="con_hover_reply_icon" />
				<span className="con_hover_reply_text" onClick={handleEditText}>
					Edit
				</span>
			</li>
			<li className="con_hover_reply">
				<MdInfoOutline className="con_hover_reply_icon" />
				<span className="con_hover_reply_text">Info</span>
			</li>
			<li className="con_hover_delete_container">
				<button className="con_hover_delete">
					<RiDeleteBinLine className="con_hover_reply_icon" />
					<span className="con_hover_reply_text">Delete for me</span>
				</button>
				<button className="con_hover_delete">
					<RiDeleteBinLine className="con_hover_reply_icon" />
					<span className="con_hover_reply_text">Delete for both</span>
				</button>
			</li>
		</ul>
	);
};

export default ConverstionOptions;
