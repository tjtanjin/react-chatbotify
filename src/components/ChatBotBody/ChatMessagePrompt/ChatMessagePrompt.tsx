import { useState, MouseEvent } from "react";

import { useBotRefsContext } from "../../../context/BotRefsContext";
import { useBotStatesContext } from "../../../context/BotStatesContext";
import { useSettingsContext } from "../../../context/SettingsContext";
import { useStylesContext } from "../../../context/StylesContext";
import { useChatWindowInternal } from "../../../hooks/internal/useChatWindowInternal";

import "./ChatMessagePrompt.css";

/**
 * Provides scroll to bottom option for users when there are unread messages.
 */
const ChatMessagePrompt = () => {

	// handles settings
	const { settings } = useSettingsContext();

	// handles styles
	const { styles } = useStylesContext();

	// handles bot states
	const { unreadCount, isScrolling } = useBotStatesContext();

	// handles bot refs
	const { chatBodyRef } = useBotRefsContext();

	// handles chat window
	const { scrollToBottom } = useChatWindowInternal();

	// tracks if chat message prompt is hovered
	const [isHovered, setIsHovered] = useState<boolean>(false);

	// styles for chat message prompt hovered
	const chatMessagePromptHoveredStyle: React.CSSProperties = {
		color: settings.general?.primaryColor,
		borderColor: settings.general?.primaryColor,
		...styles.chatMessagePromptHoveredStyle
	};

	/**
	 * Handles mouse enter event on chat message prompt.
	 */
	const handleMouseEnter = () => {
		setIsHovered(true);
	};

	/**
	 * Handles mouse leave event on chat message prompt.
	 */
	const handleMouseLeave = () => {
		setIsHovered(false);
	};

	/**
     * Checks visibility of message prompt for new messages.
     */
	const getMessagePromptVisibility = () => {
		const shouldShowPrompt = chatBodyRef.current
            && settings.chatWindow?.showMessagePrompt
            && isScrolling
            && unreadCount > 0;
		return shouldShowPrompt ? "visible" : "hidden";
	};

	return (
		<div className={`rcb-message-prompt-container ${getMessagePromptVisibility()}`}>
			<div
				onMouseEnter={handleMouseEnter}
				onMouseLeave={handleMouseLeave} 
				style={isHovered ? chatMessagePromptHoveredStyle : {...styles.chatMessagePromptStyle}}
				onMouseDown={(event: MouseEvent) => {
					event.preventDefault();
					scrollToBottom(600);
				}}
				className="rcb-message-prompt-text"
			>
				{settings.chatWindow?.messagePromptText}
			</div>
		</div>
	);
};

export default ChatMessagePrompt;
