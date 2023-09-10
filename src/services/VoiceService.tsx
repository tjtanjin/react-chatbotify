import { RefObject } from "react";

import { Options } from "../types/Options";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SpeechRecognition = (window as any).speechRecognition || (window as any).webkitSpeechRecognition;
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
 * @param inputRef reference to textarea for input
 */
export const startVoiceRecording = (botOptions: Options, handleToggleVoice: () => void,
	triggerSendVoiceInput: () => void, inputRef: RefObject<HTMLTextAreaElement>) => {

	if (recognition == null) {
		return;
	}
	
	if (!toggleOn) {
		toggleOn = true;
		recognition.start();
	}

	const inactivityPeriod = botOptions.voice?.timeoutPeriod;
	const autoSendPeriod = botOptions.voice?.autoSendPeriod;

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	recognition.onresult = (event: any) => {
		clearTimeout(inactivityTimer as ReturnType<typeof setTimeout>);
		inactivityTimer = null;
		clearTimeout(autoSendTimer);

		const voiceInput = event.results[event.results.length - 1][0].transcript;
		if (inputRef.current) {
			inputRef.current.value = inputRef.current.value + voiceInput;
		}

		inactivityTimer = setTimeout(() => handleTimeout(handleToggleVoice), inactivityPeriod);
		if (!botOptions.voice?.autoSendDisabled) {
			autoSendTimer = setTimeout(triggerSendVoiceInput, autoSendPeriod);
		}
	};

	recognition.onend = () => {
		if (toggleOn) {
			recognition.start();
			if (inactivityTimer == null) {
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
	if (recognition == null) {
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

	if (botOptions.voice?.disabled || !botOptions.chatInput?.blockSpam || recognition == null) {
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