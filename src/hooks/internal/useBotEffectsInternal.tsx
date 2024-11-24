import { useEffect, useRef } from "react";

import ChatHistoryButton from "../../components/ChatHistoryButton/ChatHistoryButton";
import { preProcessBlock } from "../../services/BlockService/BlockService";
import {
	clearHistoryMessages,
	getHistoryMessages,
	setHistoryStorageValues
} from "../../services/ChatHistoryService";
import { createMessage } from "../../utils/messageBuilder";
import { useIsDesktopInternal } from "./useIsDesktopInternal";
import { useChatWindowInternal } from "./useChatWindowInternal";
import { useNotificationInternal } from "./useNotificationsInternal";
import { useFirstInteractionInternal } from "./useFirstInteractionInternal";
import { useChatHistoryInternal } from "./useChatHistoryInternal";
import { usePathsInternal } from "./usePathsInternal";
import { useTextAreaInternal } from "./useTextAreaInternal";
import { useMessagesInternal } from "./useMessagesInternal";
import { useToastsInternal } from "./useToastsInternal";
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
export const useBotEffectsInternal = () => {
	// handles platform
	const isDesktop = useIsDesktopInternal();

	// handles settings
	const { settings } = useSettingsContext();

	// handles messages
	const {
		endStreamMessage,
		injectMessage,
		removeMessage,
		streamMessage,
		replaceMessages,
	} = useMessagesInternal();

	// handles paths
	const { getCurrPath, getPrevPath, goToPath, paths } = usePathsInternal();

	// handles toast
	const { showToast, dismissToast } = useToastsInternal();

	// handles bot states
	const {
		isBotTyping,
		isChatWindowOpen,
		isScrolling,
		hasFlowStarted,
		setIsChatWindowOpen,
		setTextAreaDisabled,
		setAudioToggledOn,
		setVoiceToggledOn,
		setIsBotTyping,
		setTextAreaSensitiveMode,
		setBlockAllowsAttachment,
		setTimeoutId
	} = useBotStatesContext();

	// handles bot refs
	const { chatBodyRef, flowRef, streamMessageMap, paramsInputRef, keepVoiceOnRef } = useBotRefsContext();
	const flow = flowRef.current as Flow;

	// handles chat window
	const { viewportHeight, setViewportHeight, setViewportWidth, openChat } = useChatWindowInternal();

	// handles notifications
	const { setUpNotifications } = useNotificationInternal();

	// handles user first interaction
	const { handleFirstInteraction } = useFirstInteractionInternal();

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

	// default setup for notifications, text area, chat window, audio and voice
	useEffect(() => {
		setUpNotifications();
		setTextAreaDisabled(settings.chatInput?.disabled as boolean);
		setIsChatWindowOpen(settings.chatWindow?.defaultOpen as boolean);
		setAudioToggledOn(settings.audio?.defaultToggledOn as boolean);

		// delay required for default voice toggled on to work if it is set to true
		setTimeout(() => {
			setVoiceToggledOn(settings.voice?.defaultToggledOn as boolean);
		}, 1)
	}, [])

	// scrolls to bottom if bot is typing and user is not scrolling
	useEffect(() => {
		if (!isScrolling && chatBodyRef?.current) {
			chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
		}
	}, [isBotTyping])

	// renders chat history button if enabled and triggers update if chat history configurations change
	useEffect(() => {
		if (settings.chatHistory?.disabled) {
			clearHistoryMessages();
		} else {
			setHistoryStorageValues(settings);
			const historyMessages = getHistoryMessages();
			if (historyMessages.length > 0) {
				// note: must always render this button even if autoload (chat history logic relies on system message)
				const messageContent = createMessage(<ChatHistoryButton/>, "SYSTEM");
				replaceMessages([messageContent]);
				if (settings.chatHistory?.autoLoad) {
					showChatHistory();
				}
			}
		}
	}, [settings.chatHistory?.storageKey, settings.chatHistory?.maxEntries, settings.chatHistory?.disabled]);

	// handles virtualkeyboard api (if supported on browser) on mobile devices
	useEffect(() => {
		if (isDesktop || settings.general?.embedded || !navigator.virtualKeyboard) {
			return;
		}

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
	}, [isDesktop]);

	// handles scrolling/resizing window on mobile devices
	useEffect(() => {
		if (isDesktop) {
			return;
		}

		if (isChatWindowOpen) {
			setViewportHeight(window.visualViewport?.height as number);
			setViewportWidth(window.visualViewport?.width as number);
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
	}, [isChatWindowOpen, isDesktop]);

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

		const params = {prevPath: getPrevPath(), currPath: getCurrPath(), goToPath, setTextAreaValue,
			userInput: paramsInputRef.current, endStreamMessage, injectMessage, removeMessage, streamMessage,
			openChat, showToast, dismissToast
		};

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

			// auto cleanup streaming and save messages on path change (not ideal)
			// todo: remove this in v3, users should call `params.endStreamMessage()`
			streamMessageMap.current.clear();
		}
		callNewBlock(currPath, block, params);
	}, [paths]);

	// adds start path when folow is started
	useEffect(() => {
		if (hasFlowStarted || settings.general?.flowStartTrigger === "ON_LOAD") {
			goToPath("start");
		}
	}, [hasFlowStarted, settings.general?.flowStartTrigger]);
};
