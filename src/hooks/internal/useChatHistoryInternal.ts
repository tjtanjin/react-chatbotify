import { useCallback } from "react";

import { getHistoryMessages, loadChatHistory } from "../../services/ChatHistoryService";
import { useDispatchRcbEventInternal } from "./useDispatchRcbEventInternal";
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

	// handles messages
	const { setSyncedMessages, syncedMessagesRef } = useMessagesContext();

	// handles bot states
	const {
		isLoadingChatHistory,
		setIsLoadingChatHistory,
		hasChatHistoryLoaded,
		setHasChatHistoryLoaded,
	} = useBotStatesContext();

	// handles bot refs
	const { chatBodyRef } = useBotRefsContext();

	// handles rcb events
	const { dispatchRcbEvent } = useDispatchRcbEventInternal();

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
			const event = await dispatchRcbEvent(RcbEvent.LOAD_CHAT_HISTORY, {});
			if (event.defaultPrevented) {
				return;
			}
		}
		setIsLoadingChatHistory(true);
		const chatScrollHeight = chatBodyRef.current?.scrollHeight ?? 0;
		loadChatHistory(settings, styles, chatHistory, setSyncedMessages, syncedMessagesRef,
			chatBodyRef, chatScrollHeight, setIsLoadingChatHistory, setHasChatHistoryLoaded,
		);
	}, [
		settings,
		styles,
		dispatchRcbEvent,
		syncedMessagesRef,
		chatBodyRef,
		setIsLoadingChatHistory,
		setHasChatHistoryLoaded
	]);

	return { isLoadingChatHistory, setIsLoadingChatHistory, hasChatHistoryLoaded, showChatHistory };
};
