import { useCallback } from "react";

import { postProcessBlock } from "../../services/BlockService/BlockService";
import { processIsSensitive } from "../../services/BlockService/IsSensitiveProcessor";
import { usePathsInternal } from "./usePathsInternal";
import { useMessagesInternal } from "./useMessagesInternal";
import { useRcbEventInternal } from "./useRcbEventInternal";
import { useVoiceInternal } from "./useVoiceInternal";
import { useTextAreaInternal } from "./useTextAreaInternal";
import { useChatWindowInternal } from "./useChatWindowInternal";
import { useToastsInternal } from "./useToastsInternal";
import { useBotStatesContext } from "../../context/BotStatesContext";
import { useBotRefsContext } from "../../context/BotRefsContext";
import { useSettingsContext } from "../../context/SettingsContext";
import { Flow } from "../../types/Flow";
import { RcbEvent } from "../../constants/RcbEvent";

/**
 * Internal custom hook for managing user input submissions.
 */
export const useSubmitInputInternal = () => {
	// handles settings
	const { settings } = useSettingsContext();

	// handles messages
	const { endStreamMessage, injectMessage, removeMessage, streamMessage } = useMessagesInternal();

	// handles paths
	const { getCurrPath, getPrevPath, goToPath } = usePathsInternal();

	// handles bot states
	const {
		timeoutId,
		voiceToggledOn,
		setTextAreaSensitiveMode,
		textAreaSensitiveMode,
		setTextAreaDisabled,
		setIsBotTyping,
		setBlockAllowsAttachment,
		setInputLength
	} = useBotStatesContext();

	// handles bot refs
	const { flowRef, chatBodyRef, inputRef, keepVoiceOnRef, paramsInputRef } = useBotRefsContext();

	// handles toasts
	const { showToast, dismissToast } = useToastsInternal();

	// handles rcb events
	const { callRcbEvent } = useRcbEventInternal();

	// handles voice
	const { syncVoice } = useVoiceInternal();

	// handles input text area
	const { setTextAreaValue } = useTextAreaInternal();

	// handles chat window
	const { openChat } = useChatWindowInternal();

	/**
	 * Handles sending of user input to check if should send as plain text or sensitive info.
	 * 
	 * @param userInput input provided by the user
	 */
	const handleSendUserInput = useCallback(async (userInput: string) => {
		const currPath = getCurrPath();
		if (!currPath) {
			return;
		}

		const block = (flowRef.current as Flow)[currPath];
		if (!block) {
			return;
		}

		if (textAreaSensitiveMode) {
			if (settings?.sensitiveInput?.hideInUserBubble) {
				return;
			} else if (settings?.sensitiveInput?.maskInUserBubble) {
				await injectMessage("*".repeat(settings.sensitiveInput?.asterisksCount as number ?? 10), "USER");
				return;
			}
		}

		await injectMessage(userInput, "USER");
	}, [flowRef, getCurrPath, settings, injectMessage, textAreaSensitiveMode]);

	/**
	 * Handles action input from the user which includes text, files and emoji.
	 * 
	 * @param path path to process input with
	 * @param userInput input provided by the user
	 * @param sendUserInput boolean indicating if user input should be sent as a message into the chat window
	 */
	const handleActionInput = useCallback(async (path: keyof Flow, userInput: string, sendUserInput = true) => {
		userInput = userInput.trim();
		if (userInput === "") {
			return;
		}

		// sends user message into chat body
		if (sendUserInput) {
			await handleSendUserInput(userInput);
		}

		// if transition attribute was used, clear timeout
		if (timeoutId) {
			clearTimeout(timeoutId);
		}

		// keeps a reference to current input for use in attribute params
		paramsInputRef.current = userInput;

		// scrolls to the bottom when a new message is sent by the user
		if (chatBodyRef.current) {
			chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
		}

		// clears input field
		if (inputRef.current) {
			setTextAreaValue("");
			setInputLength(0);
		}

		// disables text area is block spam is true
		if (settings.chatInput?.blockSpam) {
			setTextAreaDisabled(true);
		}

		// tracks if voice is to be kept on later
		keepVoiceOnRef.current = voiceToggledOn;
		syncVoice(false);
		
		// shows bot typing indicator
		setTimeout(() => {
			setIsBotTyping(true);
		}, 400);

		// after user sends input, set sensitive mode to false first (default)
		// will be overriden if next block also has isSensitive attribute
		setTextAreaSensitiveMode(false);

		setTimeout(async () => {
			const params = {prevPath: getPrevPath(), currPath: getCurrPath(), goToPath, setTextAreaValue, userInput, 
				injectMessage, streamMessage, removeMessage, endStreamMessage, openChat, showToast, dismissToast
			};
			const hasNextPath = await postProcessBlock(flowRef.current as Flow, path, params, goToPath);
			if (!hasNextPath) {
				const currPath = getCurrPath();
				if (!currPath) {
					return;
				}

				const block = (flowRef.current as Flow)[currPath];
				if (!block) {
					return;
				}
				if (!block.chatDisabled) {
					setTextAreaDisabled(settings.chatInput?.disabled as boolean);
				}
				processIsSensitive(block, setTextAreaSensitiveMode, params);
				setBlockAllowsAttachment(typeof block.file === "function");
				syncVoice(keepVoiceOnRef.current);
				setIsBotTyping(false);
			}
		}, settings.chatInput?.botDelay);
	}, [timeoutId, settings.chatInput?.blockSpam, settings.chatInput?.botDelay, settings.chatInput?.disabled,
		keepVoiceOnRef, voiceToggledOn, syncVoice, handleSendUserInput, getPrevPath, getCurrPath, goToPath,
		injectMessage, streamMessage, removeMessage, endStreamMessage, openChat, showToast, dismissToast, flowRef]);

	/**
	 * Handles submission of user input via enter key or send button.
	 * 
	 * @param inputText input to send, if not provided defaults to text area value
	 */
	const handleSubmitText = useCallback(async (inputText?: string, sendInChat = true) => {
		// if no user input provided, grab from text area
		inputText = inputText ?? inputRef.current?.value as string;

		// handles user send text event
		if (settings.event?.rcbUserSubmitText) {
			const event = await callRcbEvent(RcbEvent.USER_SUBMIT_TEXT, {inputText, sendInChat});
			if (event.defaultPrevented) {
				return;
			}
		}
		
		const currPath = getCurrPath();
		if (!currPath) {
			return;
		}
		handleActionInput(currPath, inputText, sendInChat);
	}, [callRcbEvent, getCurrPath, handleActionInput, inputRef, settings.event?.rcbUserSubmitText])

	return { handleSubmitText }
};
