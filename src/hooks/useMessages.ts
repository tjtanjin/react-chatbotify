import { useMessagesInternal } from './internal/useMessagesInternal';

/**
 * External custom hook for managing messages.
 */
export const useMessages = () => {
	// handles messages
	const { endStreamMessage, injectMessage, streamMessage, messages, setMessages } = useMessagesInternal();

	return {
		endStreamMessage,
		injectMessage,
		streamMessage,
		messages,
		setMessages,
	};
};
