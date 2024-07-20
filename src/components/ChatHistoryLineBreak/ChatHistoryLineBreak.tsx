import { useSettings } from "../../context/SettingsContext";

import "./ChatHistoryLineBreak.css";

/**
 * Indicates the start of old messages when viewing history.
 */
const ChatHistoryLineBreak = () => {

	// handles options for bot
	const { settings } = useSettings();

	return (
		<div className="rcb-line-break-container">
			<div style={settings.chatHistoryLineBreakStyle} className="rcb-line-break-text">
				{settings.chatHistory?.chatHistoryLineBreakText}
			</div>
		</div>
	);
};

export default ChatHistoryLineBreak;