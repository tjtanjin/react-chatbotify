import { useState, MouseEvent } from "react";

import { useBotOptions } from "../../context/BotOptionsContext";

import "./ChatHistoryButton.css";

/**
 * Supports viewing of old messages.
 * 
 * @param chatHistory string representation of old chat messages
 * @param showChatHistory entry point for showing of chat history
 */
const ChatHistoryButton = ({
	chatHistory,
	showChatHistory
}: {
	chatHistory: string;
	showChatHistory: (chatHistory: string) => void;
}) => {

	// handles options for bot
	const { botOptions } = useBotOptions();

	// tracks if view history button is hovered
	const [isHovered, setIsHovered] = useState<boolean>(false);

	// styles for view chat history hovered button
	const chatHistoryButtonHoveredStyle = {
		color: botOptions.theme?.primaryColor,
		borderColor: botOptions.theme?.primaryColor,
		...botOptions.chatHistoryButtonHoveredStyle
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
				style={isHovered ? chatHistoryButtonHoveredStyle : botOptions.chatHistoryButtonStyle}
				onMouseDown={(event: MouseEvent) => {
					event.preventDefault();
					showChatHistory(chatHistory);
				}}
				className="rcb-view-history-button"
			>
				{botOptions.chatHistory?.viewChatHistoryButtonText}
			</div>
		</div>
	);
};

export default ChatHistoryButton;