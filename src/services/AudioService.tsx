import { Message } from "../types/Message";
import { Options } from "../types/Options";

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
	const utterance = new SpeechSynthesisUtterance();
	utterance.text = message;
	utterance.lang = language;
	utterance.rate = rate;
	utterance.volume = volume;

	let voiceIdentified = false;
	for (const voiceName in voiceNames) {
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
 * @param botOptions options provide to the bot
 * @param voiceToggledOn boolean indicating if voice is toggled on
 * @param message message to read out
 */
export const processAudio = (botOptions: Options, voiceToggledOn: boolean, message: Message) => {
	if (botOptions.audio?.disabled || message.isUser || typeof message.content !== "string"
		|| (!botOptions?.isOpen && !botOptions.theme?.embedded) || !voiceToggledOn) {
		return;
	}

	speak(message.content, botOptions.audio?.language as string, botOptions.audio?.voiceNames as string[],
		botOptions.audio?.rate as number, botOptions.audio?.volume as number);
}