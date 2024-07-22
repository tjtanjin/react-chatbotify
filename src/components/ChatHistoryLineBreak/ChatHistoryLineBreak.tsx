import { useSettings } from "../../context/SettingsContext";
import { useBotStyles } from "../../context/BotStylesContext";

import "./ChatHistoryLineBreak.css";

/**
 * Indicates the start of old messages when viewing history.
 */
const ChatHistoryLineBreak = () => {

	// handles settings for bot
	const { settings } = useSettings();

	// handles styles for bot
	const { botStyles } = useBotStyles();

	return (
		<div className="rcb-line-break-container">
			<div style={botStyles.chatHistoryLineBreakStyle} className="rcb-line-break-text">
				{settings.chatHistory?.chatHistoryLineBreakText}
			</div>
		</div>
	);
};

export default ChatHistoryLineBreak;