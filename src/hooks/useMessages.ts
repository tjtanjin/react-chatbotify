import { useMessagesInternal } from "./internal/useMessagesInternal";

/**
 * External custom hook for managing messages.
 */
export const useMessages = () => {
	// handles messages
	const {
		endStreamMessage,
		injectMessage,
		removeMessage,
		streamMessage,
		messages,
		setMessages
	} = useMessagesInternal();

	return {
		endStreamMessage,
		injectMessage,
		removeMessage,
		streamMessage,
		messages,
		setMessages,
	};
};
