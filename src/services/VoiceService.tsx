import { RefObject, Dispatch, SetStateAction } from "react";

import { Options } from "../types/Options";

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = SpeechRecognition != null ? new SpeechRecognition() : null;
let inactivityTimer: ReturnType<typeof setTimeout> | null;
let autoSendTimer: ReturnType<typeof setTimeout>;
let toggleOn = false;
let mediaRecorder: MediaRecorder | null = null;

/**
 * Starts recording user voice input with microphone.
 * 
 * @param botOptions options provided to the bot
 * @param handleToggleVoice handles toggling of voice
 * @param triggerSendVoiceInput triggers sending of voice input into chat window
 * @param setInputLength sets the input length to reflect character count & limit
 * @param setAudioChunk sets the audio chunk if voice input is sent as audio file
 * @param inputRef reference to textarea for input
 */
export const startVoiceRecording = (
	botOptions: Options,
	handleToggleVoice: () => void,
	triggerSendVoiceInput: () => void,
	setInputLength: Dispatch<SetStateAction<number>>,
	setAudioChunks: Dispatch<SetStateAction<BlobPart[]>>,
	inputRef: RefObject<HTMLTextAreaElement | HTMLInputElement>
) => {
	if (botOptions.voice?.sendAsAudio) {
		// Only use MediaRecorder when sendAsAudio is enabled
		startAudioRecording(triggerSendVoiceInput, setAudioChunks);
	} else {
		// Only use SpeechRecognition when sendAsAudio is disabled
		startSpeechRecognition(botOptions, handleToggleVoice, triggerSendVoiceInput, setInputLength, inputRef);
	}
}

/**
 * Starts voice recording for input into textarea.
 *
 * @param botOptions options provided to the bot
 * @param handleToggleVoice handles toggling of voice
 * @param triggerSendVoiceInput triggers sending of voice input into chat window
 * @param setInputLength sets the input length to reflect character count & limit
 * @param inputRef reference to textarea for input
 */
const startSpeechRecognition = (
	botOptions: Options,
	handleToggleVoice: () => void,
	triggerSendVoiceInput: () => void,
	setInputLength: Dispatch<SetStateAction<number>>,
	inputRef: RefObject<HTMLTextAreaElement | HTMLInputElement>
) => {
	if (!recognition) {
		return;
	}

	if (!toggleOn) {
		try {
			toggleOn = true;
			recognition.lang = botOptions.voice?.language as string;
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

	inactivityTimer = setTimeout(() => handleTimeout(handleToggleVoice), inactivityPeriod);
}

/**
 * Starts voice recording for sending as audio file.
 *
 * @param triggerSendVoiceInput triggers sending of voice input into chat window
 * @param setAudioChunk sets the audio chunk if voice input is sent as audio file
 */
const startAudioRecording = (
	triggerSendVoiceInput: () => void,
	setAudioChunks: Dispatch<SetStateAction<BlobPart[]>>,
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
				setAudioChunks(prev => [...prev, event.data]);
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
	if (!recognition) {
		return;
	}

	toggleOn = false;
	if (recognition) {
		recognition.stop();
	}

	if (mediaRecorder && mediaRecorder.state !== 'inactive') {
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
 * @param botOptions options provided to the bot
 */
export const syncVoiceWithChatInput = (keepVoiceOn: boolean, botOptions: Options) => {

	if (botOptions.voice?.disabled || !botOptions.chatInput?.blockSpam || !recognition) {
		return;
	}

	if (keepVoiceOn && !toggleOn) {
		toggleOn = true;
		if (botOptions.voice?.sendAsAudio) {
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
const handleTimeout = (handleToggleVoice: () => void) => {
	handleToggleVoice();
	stopVoiceRecording();
}