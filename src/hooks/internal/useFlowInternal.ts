import { useCallback } from "react";

import { useMessagesInternal } from "./useMessagesInternal";
import { usePathsInternal } from "./usePathsInternal";
import { useToastsInternal } from "./useToastsInternal";
import { useBotRefsContext } from "../../context/BotRefsContext";
import { useBotStatesContext } from "../../context/BotStatesContext";
import { setHistoryStorageValues } from "../../services/ChatHistoryService";
import { useSettingsContext } from "../../context/SettingsContext";

/**
 * Internal custom hook for managing flow.
 */
export const useFlowInternal = () => {
	// handles messages
	const { replaceMessages } = useMessagesInternal();
	
	// handles paths
	const { replacePaths } = usePathsInternal();

	// handles toasts
	const { replaceToasts } = useToastsInternal();

	// handles bot states
	const { hasFlowStarted } = useBotStatesContext();
	
	// handles bot refs
	const { flowRef } = useBotRefsContext();

	// handles bot settings
	const { settings } = useSettingsContext();
	
	/**
	 * Restarts the conversation flow for the chatbot.
	 */
	const restartFlow = useCallback(() => {
		// reloads the chat history from storage
		setHistoryStorageValues(settings)

		replaceMessages([]);
		replaceToasts([]);
		replacePaths(["start"]);
	}, [replaceMessages, replaceToasts, replacePaths, setHistoryStorageValues]);
	
	/**
	 * Retrieves the conversation flow for the chatbot.
	 */
	const getFlow = useCallback(() => {
		return flowRef?.current ?? {};
	}, [flowRef]);
	
	
	return {
		hasFlowStarted,
		restartFlow,
		getFlow
	};
}