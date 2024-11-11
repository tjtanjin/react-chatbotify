import { useCallback, useState } from "react";

import { useRcbEventInternal } from "./useRcbEventInternal";
import { useBotStatesContext } from "../../context/BotStatesContext";
import { useSettingsContext } from "../../context/SettingsContext";
import { RcbEvent } from "../../constants/RcbEvent";

/**
 * Internal custom hook for managing chat window logic.
 */
export const useChatWindowInternal = () => {
	// handles settings
	const { settings } = useSettingsContext();

	// handles bot states
	const {
		isChatWindowOpen,
		setIsChatWindowOpen,
		viewportHeight,
		setViewportHeight,
		viewportWidth,
		setViewportWidth,
		setUnreadCount
	} = useBotStatesContext();

	// handles rcb events
	const { callRcbEvent } = useRcbEventInternal();

	// tracks scroll height
	const [chatScrollHeight, setChatScrollHeight] = useState<number>(0);

	/**
	 * Toggles chat window.
	 */
	const toggleChatWindow = useCallback(async () => {
		// handles toggle chat window event
		if (settings.event?.rcbToggleChatWindow) {
			const event = await callRcbEvent(
				RcbEvent.TOGGLE_CHAT_WINDOW,
				{currState: isChatWindowOpen, newState: !isChatWindowOpen}
			);
			if (event.defaultPrevented) {
				return;
			}
		}
		setIsChatWindowOpen(prev => {
			// if currently false means opening so set unread count to 0
			if (!prev) {
				setUnreadCount(0);
			}
			return !prev;
		});
	}, [isChatWindowOpen]);

	/**
	 * Handles opening/closing of the chat window.
	 *
	 * @param isOpen boolean indicating whether to open/close the chat window
	 */
	const openChat = useCallback(async (isOpen: boolean) => {
		if (isChatWindowOpen === isOpen) {
			return;
		}
		await toggleChatWindow();
	}, [isChatWindowOpen]);

	return {
		isChatWindowOpen,
		setIsChatWindowOpen,
		toggleChatWindow,
		openChat,
		chatScrollHeight,
		setChatScrollHeight,
		viewportHeight,
		setViewportHeight,
		viewportWidth,
		setViewportWidth,
	};
};
