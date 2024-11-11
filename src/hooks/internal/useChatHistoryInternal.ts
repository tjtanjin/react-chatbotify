import { useCallback } from "react";

import { getHistoryMessages, loadChatHistory } from "../../services/ChatHistoryService";
import { useRcbEventInternal } from "./useRcbEventInternal";
import { useChatWindowInternal } from "./useChatWindowInternal";
import { useBotRefsContext } from "../../context/BotRefsContext";
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
	const {
		isLoadingChatHistory,
		setIsLoadingChatHistory,
	} = useBotStatesContext();

	// handles bot refs
	const { chatBodyRef } = useBotRefsContext();

	// handles rcb events
	const { callRcbEvent } = useRcbEventInternal();

	// handles chat window
	const { chatScrollHeight } = useChatWindowInternal();

	/**
	 * Loads and shows chat history in the chat window.
	 * 
	 * @param chatHistory chat history content to show
	 */
	const showChatHistory = useCallback(async () => {
		const chatHistory = getHistoryMessages();
		if (!chatHistory) {
			return;
		}

		// handles load chat history event
		if (settings.event?.rcbLoadChatHistory) {
			const event = await callRcbEvent(RcbEvent.LOAD_CHAT_HISTORY, {});
			if (event.defaultPrevented) {
				return;
			}
		}
		setIsLoadingChatHistory(true);
		loadChatHistory(settings, styles, chatHistory, setMessages,
			chatBodyRef, chatScrollHeight, setIsLoadingChatHistory
		);
	}, [settings, styles, setMessages]);

	return { isLoadingChatHistory, setIsLoadingChatHistory, showChatHistory };
};
