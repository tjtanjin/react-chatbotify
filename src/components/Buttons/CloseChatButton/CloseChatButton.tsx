import { MouseEvent } from "react";

import { useSettings } from "../../../context/SettingsContext";

import "./CloseChatButton.css";

/**
 * Handles closing of chat.
 */
const CloseChatButton = () => {
	// handles options for bot
	const { settings, setSettings } = useSettings();

	return (
		<div
			style={{backgroundImage: `url(${settings.header?.closeChatIcon})`}}
			onMouseDown={(event: MouseEvent) => {
				event.stopPropagation();
				setSettings({...settings, isOpen: false});
			}}
			className="rcb-close-chat-icon"
		>
		</div>
	);
};

export default CloseChatButton;
