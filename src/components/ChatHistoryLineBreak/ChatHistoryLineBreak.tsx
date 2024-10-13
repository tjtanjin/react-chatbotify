import { useSettingsContext } from "../../context/SettingsContext";
import { useStylesContext } from "../../context/StylesContext";

import "./ChatHistoryLineBreak.css";

/**
 * Indicates the start of old messages when viewing history.
 */
const ChatHistoryLineBreak = () => {

	// handles settings
	const { settings } = useSettingsContext();

	// handles styles
	const { styles } = useStylesContext();

	return (
		<div className="rcb-line-break-container">
			<div
				style={styles.chatHistoryLineBreakStyle}
				className="rcb-line-break-text"
				data-testid="chat-history-line-break-text"
			>
				{settings.chatHistory?.chatHistoryLineBreakText}
			</div>
		</div>
	);
};

export default ChatHistoryLineBreak;
