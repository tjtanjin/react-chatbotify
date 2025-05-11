import { useChatWindowInternal } from "./internal/useChatWindowInternal";


/**
 * External custom hook for managing chat window.
 */
export const useChatWindow = () => {
	// handles chat window
	const { isChatWindowOpen, toggleChatWindowOpen, toggleIsBotTyping, scrollToBottom } = useChatWindowInternal();

	return {
		isChatWindowOpen,
		toggleChatWindowOpen,
		toggleIsBotTyping,
		scrollToBottom,
	};
};
