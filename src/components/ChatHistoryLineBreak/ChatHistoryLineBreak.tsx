import { useBotSettings } from "../../context/BotSettingsContext";
import { useBotStyles } from "../../context/BotStylesContext";

import "./ChatHistoryLineBreak.css";

/**
 * Indicates the start of old messages when viewing history.
 */
const ChatHistoryLineBreak = () => {

	// handles settings for bot
	const { botSettings } = useBotSettings();

	// handles styles for bot
	const { botStyles } = useBotStyles();

	return (
		<div className="rcb-line-break-container">
			<div style={botStyles.chatHistoryLineBreakStyle} className="rcb-line-break-text">
				{botSettings.chatHistory?.chatHistoryLineBreakText}
			</div>
		</div>
	);
};

export default ChatHistoryLineBreak;