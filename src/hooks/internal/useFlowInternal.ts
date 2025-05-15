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
	const { replacePaths, goToPath } = usePathsInternal();

	// handles toasts
	const { replaceToasts } = useToastsInternal();

	// handles bot states
	const { hasFlowStarted } = useBotStatesContext();
	
	// handles bot refs
	const { flowRef, timeoutIdRef } = useBotRefsContext();

	// handles bot settings
	const { settings } = useSettingsContext();
	
	/**
	 * Restarts the conversation flow for the chatbot.
	 */
	const restartFlow = useCallback(async () => {
		// reloads the chat history from storage
		setHistoryStorageValues(settings)

		// if an interruptable transition is present, clear it too
		if (timeoutIdRef.current) {
			clearTimeout(timeoutIdRef.current);
		}

		replaceMessages([]);
		replaceToasts([]);
		replacePaths([]);
		await goToPath("start");
	}, [timeoutIdRef, settings, replaceMessages, replaceToasts, replacePaths, setHistoryStorageValues, goToPath]);
	
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