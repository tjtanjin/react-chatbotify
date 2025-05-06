import { useCallback } from "react";

import { useRcbEventInternal } from "./useRcbEventInternal";
import { useBotStatesContext } from "../../context/BotStatesContext";
import { useSettingsContext } from "../../context/SettingsContext";
import { RcbEvent } from "../../constants/RcbEvent";
import { processAudio } from "../../services/AudioService";

/**
 * Internal custom hook for managing audio.
 */
export const useAudioInternal = () => {
	const { settings } = useSettingsContext();

	// handles bot states
	const { audioToggledOn, setAudioToggledOn } = useBotStatesContext();

	// handles rcb events
	const { callRcbEvent } = useRcbEventInternal();

	/**
	 * Toggles audio feature.
	 * 
	 * @param active boolean indicating desired state (if not specified, just flips existing state)
	 */
	const toggleAudio = useCallback(async (active?: boolean) => {
		// nothing to do if state is as desired
		if (active === audioToggledOn) {
			return;
		}

		// handles toggle audio event
		if (settings.event?.rcbToggleAudio) {
			const event = await callRcbEvent(
				RcbEvent.TOGGLE_AUDIO, {currState: audioToggledOn, newState: !audioToggledOn}
			);
			if (event.defaultPrevented) {
				return;
			}
		}
		setAudioToggledOn(prev => !prev);
	}, [audioToggledOn]);

	/**
	 * Speaks out (reads aloud) a given message.
	 * 
	 * @param message message to read out
	 */
	const speakAudio = useCallback(async (text: string) => {
		if (settings.audio?.disabled || !audioToggledOn) {
			return;
		}

		let textToRead = text;
		if (settings.event?.rcbStartSpeakAudio) {
			const event = await callRcbEvent(RcbEvent.START_SPEAK_AUDIO, {textToRead});
			if (event.defaultPrevented) {
				return;
			}
			textToRead = event.data.textToRead;
			
		}
		processAudio(settings, textToRead);
	}, [settings, audioToggledOn]);

	return {
		audioToggledOn,
		speakAudio,
		toggleAudio
	};
};
