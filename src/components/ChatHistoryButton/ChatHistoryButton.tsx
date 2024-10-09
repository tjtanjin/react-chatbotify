import { useState, MouseEvent } from "react";

import { useChatHistoryInternal } from "../../hooks/internal/useChatHistoryInternal";
import { useSettingsContext } from "../../context/SettingsContext";
import { useStylesContext } from "../../context/StylesContext";

import "./ChatHistoryButton.css";

/**
 * Supports viewing of old messages.
 */
const ChatHistoryButton = () => {
	// handles settings
	const { settings } = useSettingsContext();

	// handles styles
	const { styles } = useStylesContext();

	// handles chat history
	const { showChatHistory } = useChatHistoryInternal();

	// tracks if view history button is hovered
	const [isHovered, setIsHovered] = useState<boolean>(false);

	// styles for view chat history hovered button
	const chatHistoryButtonHoveredStyle: React.CSSProperties = {
		color: settings.general?.primaryColor,
		borderColor: settings.general?.primaryColor,
		...styles.chatHistoryButtonStyle, // by default inherit the base style
		...styles.chatHistoryButtonHoveredStyle
	};

	/**
	 * Handles mouse enter event on view chat history button.
	 */
	const handleMouseEnter = () => {
		setIsHovered(true);
	};

	/**
	 * Handles mouse leave event on view chat history button.
	 */
	const handleMouseLeave = () => {
		setIsHovered(false);
	};
	
	return (
		<div className="rcb-view-history-container">
			<div
				onMouseEnter={handleMouseEnter}
				onMouseLeave={handleMouseLeave} 
				style={isHovered ? chatHistoryButtonHoveredStyle : styles.chatHistoryButtonStyle}
				onMouseDown={(event: MouseEvent) => {
					event.preventDefault();
					showChatHistory();
				}}
				className="rcb-view-history-button"
				role="button"
				tabIndex={0} 
			>
				<p>
					{settings.chatHistory?.viewChatHistoryButtonText}
				</p>
			</div>
		</div>
	);
};

export default ChatHistoryButton;
