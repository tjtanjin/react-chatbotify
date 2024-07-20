import { MouseEvent } from "react";

import { useBotSettings } from "../../../context/BotSettingsContext";

import "./CloseChatButton.css";

/**
 * Handles closing of chat.
 */
const CloseChatButton = () => {
	// handles options for bot
	const { botSettings, setBotSettings } = useBotSettings();

	return (
		<div
			style={{backgroundImage: `url(${botSettings.header?.closeChatIcon})`}}
			onMouseDown={(event: MouseEvent) => {
				event.stopPropagation();
				setBotSettings({...botSettings, isOpen: false});
			}}
			className="rcb-close-chat-icon"
		>
		</div>
	);
};

export default CloseChatButton;
