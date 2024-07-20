import { useBotSettings } from "../../context/BotSettingsContext";

import "./ChatHistoryLineBreak.css";

/**
 * Indicates the start of old messages when viewing history.
 */
const ChatHistoryLineBreak = () => {

	// handles options for bot
	const { botSettings } = useBotSettings();

	return (
		<div className="rcb-line-break-container">
			<div style={botSettings.chatHistoryLineBreakStyle} className="rcb-line-break-text">
				{botSettings.chatHistory?.chatHistoryLineBreakText}
			</div>
		</div>
	);
};

export default ChatHistoryLineBreak;