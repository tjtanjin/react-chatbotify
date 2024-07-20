import { MouseEvent } from "react";

import { useBotOptions } from "../../../context/BotOptionsContext";

import "./CloseChatButton.css";

/**
 * Handles closing of chat.
 */
const CloseChatButton = () => {
	// handles options for bot
	const { botOptions, setBotOptions } = useBotOptions();

	return (
		<div
			style={{backgroundImage: `url(${botOptions.header?.closeChatIcon})`}}
			onMouseDown={(event: MouseEvent) => {
				event.stopPropagation();
				setBotOptions({...botOptions, isOpen: false});
			}}
			className="rcb-close-chat-icon"
		>
		</div>
	);
};

export default CloseChatButton;
