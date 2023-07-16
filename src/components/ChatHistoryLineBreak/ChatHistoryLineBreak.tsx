import { useBotOptions } from "../../context/BotOptionsContext";

import "./ChatHistoryLineBreak.css";

/**
 * Indicates the start of old messages when viewing history.
 */
const ChatHistoryLineBreak = () => {

	// handles options for bot
	const { botOptions } = useBotOptions();

	return (
		<div className="rcb-line-break-container">
			<div style={botOptions.chatHistoryLineBreakStyle} className="rcb-line-break-text">
				{botOptions.chatHistory?.chatHistoryLineBreakText}
			</div>
		</div>
	);
};

export default ChatHistoryLineBreak;