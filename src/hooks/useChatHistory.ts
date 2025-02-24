import { getHistoryMessages, setHistoryMessages } from "../services/ChatHistoryService";
import { useChatHistoryInternal } from "./internal/useChatHistoryInternal";

/**
 * External custom hook for managing chat history.
 */
export const useChatHistory = () => {
	// handles chat history
	const { showChatHistory, hasChatHistoryLoaded } = useChatHistoryInternal();

	return {
		showChatHistory,
		getHistoryMessages,
		setHistoryMessages,
		hasChatHistoryLoaded,
	};
};
