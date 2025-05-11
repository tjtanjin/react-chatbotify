import { useChatWindowInternal } from "./internal/useChatWindowInternal";


/**
 * External custom hook for managing chat window.
 */
export const useChatWindow = () => {
	// handles chat window
	const { isChatWindowOpen, toggleChatWindow, toggleIsBotTyping, scrollToBottom } = useChatWindowInternal();

	return {
		isChatWindowOpen,
		toggleChatWindow,
		toggleIsBotTyping,
		scrollToBottom,
	};
};
