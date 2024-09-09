import { useEffect, useRef } from "react";

import ChatHistoryButton from "../../components/ChatHistoryButton/ChatHistoryButton";
import { preProcessBlock } from "../../services/BlockService/BlockService";
import { saveChatHistory, setHistoryStorageValues } from "../../services/ChatHistoryService";
import { isChatBotVisible, isDesktop } from "../../utils/displayChecker";
import { useChatWindowInternal } from "./useChatWindowInternal";
import { useNotificationInternal } from "./useNotificationsInternal";
import { useFirstInteractionInternal } from "./useFirstInteractionInternal";
import { useChatHistoryInternal } from "./useChatHistoryInternal";
import { usePathsInternal } from "./usePathsInternal";
import { useTextAreaInternal } from "./useTextAreaInternal";
import { useMessagesInternal } from "./useMessagesInternal";
import { useToast } from "../useToast";
import { useVoiceInternal } from "./useVoiceInternal";
import { useSettingsContext } from "../../context/SettingsContext";
import { useBotStatesContext } from "../../context/BotStatesContext";
import { useBotRefsContext } from "../../context/BotRefsContext";
import { Block } from "../../types/Block";
import { Flow } from "../../types/Flow";
import { Params } from "../../types/Params";

/**
 * Internal custom hook for common use effects.
 */
export const useBotEffectInternal = (flow: Flow) => {
	// handles settings
	const { settings } = useSettingsContext();

	// handles messages
	const { endStreamMessage, injectMessage, streamMessage, messages, setMessages } = useMessagesInternal();

	// handles paths
	const { getCurrPath, getPrevPath, goToPath, paths } = usePathsInternal();

	// handles toast
	const { injectToast } = useToast();

	// handles bot states
	const {
		isChatWindowOpen,
		isBotTyping,
		isScrolling,
		timeoutId,
		setTextAreaDisabled,
		setAudioToggledOn,
		setVoiceToggledOn,
		setIsBotTyping,
		setTextAreaSensitiveMode,
		setBlockAllowsAttachment,
		setTimeoutId
	} = useBotStatesContext();

	// handles bot refs
	const { chatBodyRef, isBotStreamingRef, paramsInputRef, keepVoiceOnRef } = useBotRefsContext();

	// handles chat window
	const { viewportHeight, setViewportHeight, setViewportWidth, openChat } = useChatWindowInternal();

	// handles notifications
	const { playNotificationSound, setUnreadCount, setUpNotifications } = useNotificationInternal();

	// handles user first interaction
	const { handleFirstInteraction, hasFlowStarted } = useFirstInteractionInternal();

	// handles chat history
	const { showChatHistory } = useChatHistoryInternal();

	// handles input text area
	const { updateTextAreaFocus, setTextAreaValue } = useTextAreaInternal();

	// handles voice
	const { syncVoice } = useVoiceInternal();

	// tracks scroll position
	const scrollPositionRef = useRef<number>(0);

	// adds listeners for first interaction
	useEffect(() => {
		window.addEventListener("click", handleFirstInteraction);
		window.addEventListener("keydown", handleFirstInteraction);
		window.addEventListener("touchstart", handleFirstInteraction);

		return () => {
			window.removeEventListener("click", handleFirstInteraction);
			window.removeEventListener("keydown", handleFirstInteraction);
			window.removeEventListener("touchstart", handleFirstInteraction);
		};
	}, []);

	// default setup for notifications, text area, audio and voice
	useEffect(() => {
		setUpNotifications();
		setTextAreaDisabled(settings.chatInput?.disabled as boolean);
		setAudioToggledOn(settings.audio?.defaultToggledOn as boolean);
		setVoiceToggledOn(settings.voice?.defaultToggledOn as boolean);
	}, [])

	// renders chat history button if enabled
	useEffect(() => {
		if (settings.chatHistory?.disabled) {
			localStorage.removeItem(settings.chatHistory?.storageKey as string);
		} else {
			const chatHistory = localStorage.getItem(settings.chatHistory?.storageKey as string);
			if (chatHistory != null) {
				// note: must always render this button even if autoload (chat history logic relies on system message)
				const messageContent = {
					content: <ChatHistoryButton chatHistory={chatHistory} />,
					sender: "system"
				};
				setMessages([messageContent]);
				if (settings.chatHistory?.autoLoad) {
					showChatHistory(chatHistory);
				}
			}
		}
	}, []);

	// triggers update to chat history options
	useEffect(() => {
		setHistoryStorageValues(settings);
	}, [settings.chatHistory?.storageKey, settings.chatHistory?.maxEntries, settings.chatHistory?.disabled]);

	// handles virtualkeyboard api (if supported on browser)
	useEffect(() => {
		// if is desktop or is embedded bot, nothing to resize
		if (isDesktop || settings.general?.embedded) {
			return;
		}
		
		if (navigator.virtualKeyboard) {
			navigator.virtualKeyboard.overlaysContent = true;
			navigator.virtualKeyboard.addEventListener("geometrychange", (event) => {
				if (!event.target) {
					return;
				}

				const { x, y, width, height } = (event.target as VirtualKeyboard).boundingRect;
				// width does not need adjustments so only height is adjusted
				if (x == 0 && y == 0 && width == 0 && height == 0) {
					// delay added as it takes time for keyboard to appear and resize the viewport height
					setTimeout(() => {
						setViewportHeight(window.visualViewport?.height as number);
					}, 101);

					// a second check added in case device lags and needs a later resizing
					setTimeout(() => {
						if (viewportHeight != window.visualViewport?.height as number) {
							setViewportHeight(window.visualViewport?.height as number);
						}
					}, 1001);
				} else {
					// delay added as it takes time for keyboard to disappear and resize the viewport height
					setTimeout(() => {
						setViewportHeight(window.visualViewport?.height as number - height);
					}, 101);
				}
			});
		}
	}, [])

	// triggers saving of chat history and checks for notifications
	useEffect(() => {
		saveChatHistory(messages);

		// if messages are empty or chatbot is open and user is not scrolling, no need to notify
		if (messages.length === 0 || isChatWindowOpen && !isScrolling) {
			return;
		}

		// if chatbot is embedded and visible, no need to notify
		if (settings.general?.embedded && isChatBotVisible(chatBodyRef.current as HTMLDivElement) || isBotTyping) {
			return;
		}

		const lastMessage = messages[messages.length - 1];
		// if message is sent by user or is bot typing or bot is embedded, return
		if (!lastMessage || lastMessage.sender === "user") {
			return;
		}

		playNotificationSound();
	}, [messages.length]);

	// saves messages once a stream ends
	useEffect(() => {
		if (!isBotStreamingRef.current) {
			saveChatHistory(messages);
		}
	}, [isBotStreamingRef.current])

	// resets unread count on opening chat and handles scrolling/resizing window on mobile devices
	useEffect(() => {
		if (isChatWindowOpen) {
			setUnreadCount(0);
			setViewportHeight(window.visualViewport?.height as number);
			setViewportWidth(window.visualViewport?.width as number);
		}

		if (isDesktop) {
			return;
		}

		// handles scrolling of window when chat is open (only for mobile view).
		const handleMobileScrollOpened = () => window.scrollTo({top: 0, left: 0, behavior: "auto"});
		// handles scrolling of window when chat is closed (only for mobile view).
		const handleMobileScrollClosed = () => scrollPositionRef.current = window.scrollY;
		const handleResize = () => {
			setViewportHeight(window.visualViewport?.height as number);
			setViewportWidth(window.visualViewport?.width as number);
		}

		const cleanupScrollEventListeners = () => {
			window.removeEventListener("scroll", handleMobileScrollOpened);
			window.removeEventListener("scroll", handleMobileScrollClosed);
			window.visualViewport?.removeEventListener("resize", handleResize);
		};

		if (isChatWindowOpen) {
			cleanupScrollEventListeners();
			document.body.style.position = "fixed";
			window.addEventListener("scroll", handleMobileScrollOpened);
			window.visualViewport?.addEventListener("resize", handleResize);
		} else {
			document.body.style.position = "static";
			cleanupScrollEventListeners();
			window.scrollTo({top: scrollPositionRef.current, left: 0, behavior: "auto"});
			window.addEventListener("scroll", handleMobileScrollClosed);
			window.visualViewport?.removeEventListener("resize", handleResize);
		}

		return cleanupScrollEventListeners;
	}, [isChatWindowOpen]);

	// performs pre-processing when paths change
	useEffect(() => {
		const currPath = getCurrPath();
		if (!currPath) {
			return;
		}
		const block = flow[currPath];

		// if path is invalid, nothing to process (i.e. becomes dead end!)
		if (!block) {
			setIsBotTyping(false);
			return;
		}

		const params = {prevPath: getPrevPath(), goToPath, setTextAreaValue, userInput: paramsInputRef.current,
			endStreamMessage, injectMessage, streamMessage, openChat, injectToast};

		// calls the new block for preprocessing upon change to path.
		const callNewBlock = async (currPath: keyof Flow, block: Block, params: Params) => {
			await preProcessBlock(flow, currPath, params, setTextAreaDisabled, setTextAreaSensitiveMode,
				goToPath, setTimeoutId
			);

			// cleanup logic after preprocessing of a block
			setIsBotTyping(false);
			if (!("chatDisabled" in block)) {
				setTextAreaDisabled(settings.chatInput?.disabled as boolean);
			}
			setBlockAllowsAttachment(typeof block.file === "function");
			updateTextAreaFocus(currPath);
			syncVoice(keepVoiceOnRef.current && !block.chatDisabled);

			// cleanup logic after preprocessing of a block (affects only streaming messages)
			isBotStreamingRef.current = false
		}
		callNewBlock(currPath, block, params);
	}, [paths]);

	// adds start path when folow is started
	useEffect(() => {
		if (hasFlowStarted || settings.general?.flowStartTrigger === "ON_LOAD") {
			goToPath("start");
		}
	}, [hasFlowStarted]);

	return { timeoutId }
};
