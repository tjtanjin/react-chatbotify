import { useBotRefsContext } from "../../context/BotRefsContext";
import { useBotStatesContext } from "../../context/BotStatesContext";
import { useMessagesContext } from "../../context/MessagesContext";
import { usePathsContext } from "../../context/PathsContext";
import { useToastsContext } from "../../context/ToastsContext";

/**
 * Internal custom hook for managing flow.
 */
export const useFlowInternal = () => {
	// handles messages
	const { setMessages } = useMessagesContext();
	
	// handles paths
	const { setPaths } = usePathsContext();

	// handles toasts
	const { setToasts } = useToastsContext();

	// handles bot states
	const { hasFlowStarted } = useBotStatesContext();
	
	// handles bot refs
	const { flowRef } = useBotRefsContext();
	
	/**
	 * Restarts the conversation flow for the chatbot.
	 */
	const restartFlow = () => {
		setMessages([]);
		setToasts([]);
		setPaths(["start"]);
	}
	
	/**
	 * Retrieves the conversation flow for the chatbot.
	 */
	const getFlow = () => {
		return flowRef.current ?? {};
	}
	
	return {
		hasFlowStarted,
		restartFlow,
		getFlow
	};
}