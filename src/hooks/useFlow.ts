import { useBotRefsContext } from "../context/BotRefsContext";
import { useMessagesContext } from "../context/MessagesContext";
import { usePathsContext } from "../context/PathsContext";
import { useToastsContext } from "../context/ToastsContext";

/**
 * External custom hook for managing flow.
 */
export const useFlow = () => {
	// handles messages
	const { setMessages } = useMessagesContext();
	
	// handles paths
	const { setPaths } = usePathsContext();

	// handles toasts
	const { setToasts } = useToastsContext();
	
	// handles bot refs
	const { flowRef } = useBotRefsContext();
	
	/**
	 * Restarts the conversation flow for the chatbot.
	 */
	const restartConversationFlow = () => {
		setMessages([]);
		setToasts([]);
		setPaths(["start"]);
	}
	
	/**
	 * Retrieves the conversation flow for the chatbot.
	 */
	const getConversationFlow = () => {
		return flowRef.current || {};
	}
	
	return {
		restartConversationFlow,
		getConversationFlow
	};
}