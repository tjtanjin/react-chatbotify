import { useState, MouseEvent } from "react";

import { useBotRefsContext } from "../../../context/BotRefsContext";
import { useBotStatesContext } from "../../../context/BotStatesContext";
import { useSettingsContext } from "../../../context/SettingsContext";
import { useStylesContext } from "../../../context/StylesContext";

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
	const { unreadCount, isScrolling, setIsScrolling } = useBotStatesContext();

	// handles bot refs
	const { chatBodyRef } = useBotRefsContext();

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
     * Handles scrolling to the bottom of the chat window with specified duration.
     */
	function scrollToBottom(duration: number) {
		if (!chatBodyRef.current) {
			return;
		}

		const start = chatBodyRef.current.scrollTop;
		const end = chatBodyRef.current.scrollHeight - chatBodyRef.current.clientHeight;
		const change = end - start;
		const increment = 20;
		let currentTime = 0;
	
		function animateScroll() {
			if (!chatBodyRef.current) {
				return;
			}
			currentTime += increment;
			const val = easeInOutQuad(currentTime, start, change, duration);
			chatBodyRef.current.scrollTop = val;
			if (currentTime < duration) {
				requestAnimationFrame(animateScroll);
			} else {
				setIsScrolling(false);
			}
		}
		
		animateScroll();
	}

	/**
	 * Helper function for custom scrolling.
	 */
	const easeInOutQuad = (t: number, b: number, c: number, d: number) => {
		t /= d / 2;
		if (t < 1) return c / 2 * t * t + b;
		t--;
		return -c / 2 * (t * (t - 2) - 1) + b;
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
				style={isHovered ? chatMessagePromptHoveredStyle : styles.chatMessagePromptStyle}
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
