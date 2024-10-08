import { RefObject, Dispatch, SetStateAction } from "react";

import { Settings } from "../types/Settings";

let recognition: SpeechRecognition | null;
let inactivityTimer: ReturnType<typeof setTimeout> | null;
let autoSendTimer: ReturnType<typeof setTimeout>;
let toggleOn = false;
let mediaRecorder: MediaRecorder | null = null;

/**
 * Get speech recognition instance if available via function call
 * to add support for SSR since window is not available on server.
 * @returns SpeechRecognition object if available, null otherwise
 */
const getSpeechRecognition = () => {
	if (!recognition) {
		const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
		recognition = SpeechRecognition != null ? new SpeechRecognition() : null;
	}

	return recognition;
};

/**
 * Starts recording user voice input with microphone.
 * 
 * @param settings options provided to the bot
 * @param toggleVoice handles toggling of voice
 * @param triggerSendVoiceInput triggers sending of voice input into chat window
 * @param setInputLength sets the input length to reflect character count & limit
 * @param audioChunksRef: reference to audio chunks
 * @param inputRef reference to textarea for input
 */
export const startVoiceRecording = (
	settings: Settings,
	toggleVoice: () => void,
	triggerSendVoiceInput: () => void,
	setTextAreaValue: (value: string) => void,
	setInputLength: Dispatch<SetStateAction<number>>,
	audioChunksRef: RefObject<BlobPart[]>,
	inputRef: RefObject<HTMLTextAreaElement | HTMLInputElement | null>
) => {
	if (settings.voice?.sendAsAudio) {
		// Only use MediaRecorder when sendAsAudio is enabled
		startAudioRecording(triggerSendVoiceInput, audioChunksRef);
	} else {
		// Only use SpeechRecognition when sendAsAudio is disabled
		startSpeechRecognition(settings, toggleVoice, triggerSendVoiceInput,
			setTextAreaValue, setInputLength, inputRef
		);
	}
}

/**
 * Starts voice recording for input into textarea.
 *
 * @param settings options provided to the bot
 * @param toggleVoice handles toggling of voice
 * @param triggerSendVoiceInput triggers sending of voice input into chat window
 * @param setInputLength sets the input length to reflect character count & limit
 * @param inputRef reference to textarea for input
 */
const startSpeechRecognition = (
	settings: Settings,
	toggleVoice: () => void,
	triggerSendVoiceInput: () => void,
	setTextAreaValue: (value: string) => void,
	setInputLength: Dispatch<SetStateAction<number>>,
	inputRef: RefObject<HTMLTextAreaElement | HTMLInputElement | null>
) => {
	const recognition = getSpeechRecognition();

	if (!recognition) {
		return;
	}

	if (!toggleOn) {
		try {
			toggleOn = true;
			recognition.lang = settings.voice?.language as string;
			recognition.start();
		} catch {
			// catches rare dom exception if user spams voice button
		}
	}

	const inactivityPeriod = settings.voice?.timeoutPeriod;
	const autoSendPeriod = settings.voice?.autoSendPeriod;

	recognition.onresult = event => {
		clearTimeout(inactivityTimer as ReturnType<typeof setTimeout>);
		inactivityTimer = null;
		clearTimeout(autoSendTimer);

		const voiceInput = event.results[event.results.length - 1][0].transcript;

		if (inputRef.current) {
			const characterLimit = settings.chatInput?.characterLimit
			const newInput = inputRef.current.value + voiceInput;
			if (characterLimit != null && characterLimit >= 0 && newInput.length > characterLimit) {
				setTextAreaValue(newInput.slice(0, characterLimit));
			} else {
				setTextAreaValue(newInput);
			}
			setInputLength(inputRef.current.value.length);
		}

		inactivityTimer = setTimeout(() => handleTimeout(toggleVoice, inputRef), inactivityPeriod);
		if (!settings.voice?.autoSendDisabled) {
			autoSendTimer = setTimeout(triggerSendVoiceInput, autoSendPeriod);
		}
	};

	recognition.onend = () => {
		if (toggleOn) {
			recognition.start();
			if (!inactivityTimer) {
				inactivityTimer = setTimeout(() => handleTimeout(toggleVoice, inputRef), inactivityPeriod);
			}
		} else {
			clearTimeout(inactivityTimer as ReturnType<typeof setTimeout>);
			inactivityTimer = null;
			clearTimeout(autoSendTimer);
		}
	};

	inactivityTimer = setTimeout(() => handleTimeout(toggleVoice, inputRef), inactivityPeriod);
}

/**
 * Starts voice recording for sending as audio file (auto send does not work for media recordings).
 *
 * @param triggerSendVoiceInput triggers sending of voice input into chat window
 * @param audioChunksRef: reference to audio chunks
 */
const startAudioRecording = (
	triggerSendVoiceInput: () => void,
	audioChunksRef: RefObject<BlobPart[]>
) => {
	navigator.mediaDevices.getUserMedia({ audio: true })
		.then(stream => {
			mediaRecorder = new MediaRecorder(stream);

			if (!toggleOn) {
				try {
					toggleOn = true;
					mediaRecorder.start();
				} catch {
					// catches rare dom exception if user spams voice button
				}
			}

			mediaRecorder.ondataavailable = event => {
				if (audioChunksRef.current) {
					audioChunksRef.current.push(event.data);
				}
			};

			mediaRecorder.onstop = () => {
				triggerSendVoiceInput();
				stream.getTracks().forEach(track => track.stop());
			};
		})
		.catch(error => {
			console.error("Unable to use microphone:", error);
		});
}

/**
 * Stops all voice recordings.
 */
export const stopVoiceRecording = () => {
	const recognition = getSpeechRecognition();

	if (!recognition) {
		return;
	}

	toggleOn = false;
	if (recognition) {
		recognition.stop();
	}

	if (mediaRecorder && mediaRecorder.state !== "inactive") {
		mediaRecorder.stop();
		mediaRecorder = null;
	}

	clearTimeout(inactivityTimer as ReturnType<typeof setTimeout>);
	inactivityTimer = null;
	clearTimeout(autoSendTimer);
}

/**
 * Syncs voice toggle to textarea state (voice should not be enabled if textarea is disabled).
 * 
 * @param keepVoiceOn boolean indicating if voice was on and thus is to be kept toggled on
 * @param settings options provided to the bot
 */
export const syncVoiceWithChatInput = (keepVoiceOn: boolean, settings: Settings) => {
	const recognition = getSpeechRecognition();

	if (settings.voice?.disabled || !settings.chatInput?.blockSpam || !recognition) {
		return;
	}

	if (keepVoiceOn && !toggleOn) {
		toggleOn = true;
		if (settings.voice?.sendAsAudio) {
			mediaRecorder?.start();
		} else {
			recognition.start();
		}
	} else if (!keepVoiceOn) {
		stopVoiceRecording();
	}
}

/**
 * Handles timeout for automatically turning off voice.
 * 
 * @param handleToggleVoice handles toggling of voice
 */
const handleTimeout = (toggleVoice: () => void, inputRef: RefObject<HTMLTextAreaElement | HTMLInputElement | null>) => {
	if (!inputRef.current?.disabled) {
		toggleVoice();
	}
	stopVoiceRecording();
}