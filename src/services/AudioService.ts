import { stripHtml } from "../utils/markupParser";
import { Message } from "../types/Message";
import { Settings } from "../types/Settings";

/**
 * Handles reading out of messages sent by the bot.
 * 
 * @param message message to read out
 * @param language language to listen for
 * @param voiceNames list of voice names to use
 * @param rate speech rate
 * @param volume play volume
 */
const speak = (message: string, language: string, voiceNames: string[], rate: number, volume: number) => {
	if (!window.SpeechSynthesisUtterance) {
		console.info("Speech Synthesis API is not supported in this environment.");
		return;
	}

	const utterance = new window.SpeechSynthesisUtterance();
	utterance.text = message;
	utterance.lang = language;
	utterance.rate = rate;
	utterance.volume = volume;

	let voiceIdentified = false;
	for (const voiceName of voiceNames) {
		window.speechSynthesis.getVoices().find((voice) => {
			if (voice.name === voiceName) {
				utterance.voice = voice;
				window.speechSynthesis.speak(utterance);
				voiceIdentified = true;
				return;
			}
		});
		if (voiceIdentified) {
			break;
		}
	}
	
	// if cannot find voice, use default
	if (!voiceIdentified) {
		window.speechSynthesis.speak(utterance);
	}
}

/**
 * Handles logic for whether a bot message should be read out.
 * 
 * @param settings options provided to the bot
 * @param voiceToggledOn boolean indicating if voice is toggled on
 * @param isChatWindowOpen boolean indicating if chat window is open
 * @param message message to read out
 * @param useMarkup boolean indicating if markup is used
 */
export const processAudio = (settings: Settings, voiceToggledOn: boolean,
	isChatWindowOpen: boolean, message: Message, useMarkup: boolean) => {

	// Add check for empty message content
	if (settings.audio?.disabled || message.sender.toUpperCase() === "USER" || typeof message.content !== "string"
		|| (!isChatWindowOpen && !settings.general?.embedded) || !voiceToggledOn
		|| message.content.trim() === "") { // Check for empty message content
		return;
	}

	let textToRead = message.content;
	if (useMarkup) {
		textToRead = stripHtml(message.content);
	}

	speak(textToRead, settings.audio?.language as string, settings.audio?.voiceNames as string[],
		settings.audio?.rate as number, settings.audio?.volume as number);
}
