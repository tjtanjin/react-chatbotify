import { useCallback } from "react";

import { useRcbEventInternal } from "./useRcbEventInternal";
import { useBotStatesContext } from "../../context/BotStatesContext";
import { useBotRefsContext } from "../../context/BotRefsContext";
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
		setSyncedIsChatWindowOpen,
		viewportHeight,
		setViewportHeight,
		viewportWidth,
		setViewportWidth,
		setUnreadCount,
		setSyncedIsBotTyping,
		setSyncedIsScrolling,
		syncedIsBotTypingRef,
		syncedIsChatWindowOpenRef,
	} = useBotStatesContext();

	const { chatBodyRef } = useBotRefsContext();

	// handles rcb events
	const { callRcbEvent } = useRcbEventInternal();

	/**
	 * Toggles chat window.
	 * 
	 * @param active boolean indicating desired state (if not specified, just flips existing state)
	 */
	const toggleChatWindowOpen = useCallback(async (active?: boolean) => {
		// nothing to do if state is as desired
		if (active === syncedIsChatWindowOpenRef.current) {
			return;
		}

		// handles toggle chat window event
		if (settings.event?.rcbToggleChatWindow) {
			const event = await callRcbEvent(
				RcbEvent.TOGGLE_CHAT_WINDOW,
				{
					currState: syncedIsChatWindowOpenRef.current,
					newState: !syncedIsChatWindowOpenRef.current
				}
			);
			if (event.defaultPrevented) {
				return;
			}
		}
		setSyncedIsChatWindowOpen(prev => {
			// if currently false means opening so set unread count to 0
			if (!prev) {
				setUnreadCount(0);
			}
			return !prev;
		});
	}, [syncedIsChatWindowOpenRef]);

	/**
	 * Forces state for showing typing indicator.
	 * 
	 * @param active boolean indicating desired state (if not specified, just flips existing state)
	 */
	const toggleIsBotTyping = useCallback(async (active?: boolean) => {
		if (active === syncedIsBotTypingRef.current) {
			return
		}
		setSyncedIsBotTyping(prev => !prev);
	}, [syncedIsBotTypingRef])

	/**
	 * Helper function for custom scrolling.
	 */
	const easeInOutQuad = useCallback((t: number, b: number, c: number, d: number) => {
		t /= d / 2;
		if (t < 1) return c / 2 * t * t + b;
		t--;
		return -c / 2 * (t * (t - 2) - 1) + b;
	}, []);

	/**
     * Handles scrolling to the bottom of the chat window with specified duration.
	 * 
	 * @param duration time in milliseconds to get to bottom
     */
	const scrollToBottom = useCallback((duration: number = 0) => {
		if (!chatBodyRef.current) {
			return;
		}

		const end = chatBodyRef.current.scrollHeight - chatBodyRef.current.clientHeight;
		if (duration <= 0) {
			chatBodyRef.current.scrollTop = end;
			setSyncedIsScrolling(false);
			return;
		}

		const start = chatBodyRef.current.scrollTop;
		const change = end - start;
		const increment = 20;
		let currentTime = 0;
	
		const animateScroll = () => {
			if (!chatBodyRef.current) {
				return;
			}
			currentTime += increment;
			const val = easeInOutQuad(currentTime, start, change, duration);
			chatBodyRef.current.scrollTop = val;
			if (currentTime < duration) {
				requestAnimationFrame(animateScroll);
			} else {
				setSyncedIsScrolling(false);
			}
		}
		
		animateScroll();
	}, [chatBodyRef])

	return {
		isChatWindowOpen,
		setSyncedIsChatWindowOpen,
		toggleChatWindowOpen,
		viewportHeight,
		setViewportHeight,
		viewportWidth,
		setViewportWidth,
		toggleIsBotTyping,
		scrollToBottom,
	};
};
