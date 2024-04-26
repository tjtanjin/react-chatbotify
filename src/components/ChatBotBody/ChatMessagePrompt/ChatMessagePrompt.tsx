import { RefObject, useState, MouseEvent, Dispatch, SetStateAction } from "react";

import { useBotOptions } from "../../../context/BotOptionsContext";

import "./ChatMessagePrompt.css";

/**
 * Provides scroll to bottom option for users when there are unread messages.
 * 
 * @param chatBodyRef reference to the chat body
 * @param isScrolling boolean representing whether user is scrolling chat
 * @param setIsScrolling setter for tracking if user is scrolling
 * @param unreadCount number representing unread messages count
 */
const ChatMessagePrompt = ({
	chatBodyRef,
	isScrolling,
	setIsScrolling,
	unreadCount,
}: {
	chatBodyRef: RefObject<HTMLDivElement>;
    isScrolling: boolean;
    setIsScrolling: Dispatch<SetStateAction<boolean>>;
	unreadCount: number;
}) => {

	// handles options for bot
	const { botOptions } = useBotOptions();

	// tracks if chat message prompt is hovered
	const [isHovered, setIsHovered] = useState<boolean>(false);

	// styles for chat message prompt hovered
	const chatMessagePromptHoveredStyle: React.CSSProperties = {
		color: botOptions.theme?.primaryColor,
		borderColor: botOptions.theme?.primaryColor,
		...botOptions.chatMessagePromptHoveredStyle
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
            && botOptions.chatWindow?.showMessagePrompt
            && isScrolling
            && unreadCount > 0;
		return shouldShowPrompt ? "visible" : "hidden";
	};

	return (
		<div className={`rcb-message-prompt-container ${getMessagePromptVisibility()}`}>
			<div
				onMouseEnter={handleMouseEnter}
				onMouseLeave={handleMouseLeave} 
				style={isHovered ? chatMessagePromptHoveredStyle : botOptions.chatMessagePromptStyle}
				onMouseDown={(event: MouseEvent) => {
					event.preventDefault();
					scrollToBottom(600);
				}}
				className="rcb-message-prompt-text"
			>
				{botOptions.chatWindow?.messagePromptText}
			</div>
		</div>
	);
};

export default ChatMessagePrompt;