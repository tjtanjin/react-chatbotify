import { RefObject, Dispatch, SetStateAction } from "react";

import { Options } from "../types/Options";

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = SpeechRecognition != null ? new SpeechRecognition() : null;
let inactivityTimer: ReturnType<typeof setTimeout> | null;
let autoSendTimer: ReturnType<typeof setTimeout>;
let toggleOn = false;

/**
 * Starts voice recording for input into textarea.
 * 
 * @param botOptions options provided to the bot
 * @param handleToggleVoice handles toggling of voice
 * @param triggerSendVoiceInput triggers sending of voice input into chat window
 * @param setInputLength sets the input length to reflect character count & limit
 * @param inputRef reference to textarea for input
 */
export const startVoiceRecording = (botOptions: Options, handleToggleVoice: () => void,
	triggerSendVoiceInput: () => void, setInputLength: Dispatch<SetStateAction<number>>,
	inputRef: RefObject<HTMLTextAreaElement | HTMLInputElement>) => {

	if (!recognition) {
		return;
	}
	
	if (!toggleOn) {
		try {
			toggleOn = true;
			recognition.start();
		} catch {
			// catches rare dom exception if user spams voice button
		}
	}

	const inactivityPeriod = botOptions.voice?.timeoutPeriod;
	const autoSendPeriod = botOptions.voice?.autoSendPeriod;

	recognition.onresult = event => {
		clearTimeout(inactivityTimer as ReturnType<typeof setTimeout>);
		inactivityTimer = null;
		clearTimeout(autoSendTimer);

		const voiceInput = event.results[event.results.length - 1][0].transcript;

		if (inputRef.current) {
			const characterLimit = botOptions.chatInput?.characterLimit
			const newInput = inputRef.current.value + voiceInput;
			if (characterLimit != null && characterLimit >= 0 && newInput.length > characterLimit) {
				inputRef.current.value = newInput.slice(0, characterLimit);
			} else {
				inputRef.current.value = newInput
			}
			setInputLength(inputRef.current.value.length);
		}

		inactivityTimer = setTimeout(() => handleTimeout(handleToggleVoice), inactivityPeriod);
		if (!botOptions.voice?.autoSendDisabled) {
			autoSendTimer = setTimeout(triggerSendVoiceInput, autoSendPeriod);
		}
	};

	recognition.onend = () => {
		if (toggleOn) {
			recognition.start();
			if (!inactivityTimer) {
				inactivityTimer = setTimeout(() => handleTimeout(handleToggleVoice), inactivityPeriod);
			}
		} else {
			clearTimeout(inactivityTimer as ReturnType<typeof setTimeout>);
			inactivityTimer = null;
			clearTimeout(autoSendTimer);
		}
	};

	// Start the inactivity timer
	inactivityTimer = setTimeout(() => handleTimeout(handleToggleVoice), inactivityPeriod);
}

/**
 * Stops voice recording.
 */
export const stopVoiceRecording = () => {
	if (!recognition) {
		return;
	}

	toggleOn = false;
	if (recognition) {
		recognition.stop();
	}
}

/**
 * Syncs voice toggle to textarea state (voice should not be enabled if textarea is disabled).
 * 
 * @param keepVoiceOn boolean indicating if voice was and thus is to be kept toggled on
 * @param botOptions options provided to the bot
 */
export const syncVoiceWithChatInput = (keepVoiceOn: boolean, botOptions: Options) => {

	if (botOptions.voice?.disabled || !botOptions.chatInput?.blockSpam || !recognition) {
		return;
	}

	if (keepVoiceOn && !toggleOn) {
		toggleOn = true;
		recognition.start();
	} else if (!keepVoiceOn) {
		stopVoiceRecording();
	}
}

/**
 * Handles timeout for automatically turning off voice.
 * 
 * @param handleToggleVoice handles toggling of voice
 */
const handleTimeout = (handleToggleVoice: () => void) => {
	handleToggleVoice();
	stopVoiceRecording();
}