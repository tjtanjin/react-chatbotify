import { useCallback } from "react";

import { useRcbEventInternal } from "./useRcbEventInternal";
import { loadChatHistory } from "../../services/ChatHistoryService";
import { useMessagesContext } from "../../context/MessagesContext";
import { useSettingsContext } from "../../context/SettingsContext";
import { useStylesContext } from "../../context/StylesContext";
import { useBotStatesContext } from "../../context/BotStatesContext";
import { RcbEvent } from "../../constants/RcbEvent";

/**
 * Internal custom hook for managing chat history logic.
 */
export const useChatHistoryInternal = () => {
	// handles settings
	const { settings } = useSettingsContext();

	// handles styles
	const { styles } = useStylesContext();

	// handles setting messages
	const { setMessages } = useMessagesContext();

	// handles bot states
	const { isLoadingChatHistory, setIsLoadingChatHistory, setTextAreaDisabled } = useBotStatesContext();

	// handles rcb events
	const { callRcbEvent } = useRcbEventInternal();

	/**
	 * Loads and shows chat history in the chat window.
	 * 
	 * @param chatHistory chat history content to show
	 */
	const showChatHistory = useCallback((chatHistory: string) => {
		// handles load chat history event
		if (settings.event?.rcbLoadChatHistory) {
			const event = callRcbEvent(RcbEvent.LOAD_CHAT_HISTORY, {});
			if (event.defaultPrevented) {
				return;
			}
		}

		setIsLoadingChatHistory(true);
		setTextAreaDisabled(true);
		loadChatHistory(settings, styles, chatHistory, setMessages, setTextAreaDisabled);
	}, [settings, styles, setMessages, setTextAreaDisabled]);

	return { isLoadingChatHistory, setIsLoadingChatHistory, showChatHistory };
};
