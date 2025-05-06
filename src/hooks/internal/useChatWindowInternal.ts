import { useCallback, useEffect } from "react";

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
		isScrolling,
		setIsChatWindowOpen,
		viewportHeight,
		setViewportHeight,
		viewportWidth,
		setViewportWidth,
		setUnreadCount,
		setIsBotTyping,
		setIsScrolling,
	} = useBotStatesContext();

	const { chatBodyRef, isScrollingRef } = useBotRefsContext();

	// handles rcb events
	const { callRcbEvent } = useRcbEventInternal();

	useEffect(() => {
		isScrollingRef.current = isScrolling;
	}, [isScrolling]);

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

	/**
	 * Forces state for showing typing indicator.
	 * 
	 * @param showTyping boolean indicating whether to have typing indicator shown
	 */
	const setTypingIndicator = (showTyping: boolean) => {
		setIsBotTyping(showTyping);
	}

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
			setIsScrolling(false);
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
				setIsScrolling(false);
			}
		}
		
		animateScroll();
	}, [chatBodyRef])

	return {
		isChatWindowOpen,
		setIsChatWindowOpen,
		toggleChatWindow,
		openChat,
		viewportHeight,
		setViewportHeight,
		viewportWidth,
		setViewportWidth,
		setTypingIndicator,
		scrollToBottom,
	};
};
