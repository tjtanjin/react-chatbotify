import { useCallback } from "react";

import { useDispatchRcbEventInternal } from "./useDispatchRcbEventInternal";
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
	const { audioToggledOn, setSyncedAudioToggledOn, syncedAudioToggledOnRef } = useBotStatesContext();

	// handles rcb events
	const { dispatchRcbEvent } = useDispatchRcbEventInternal();

	/**
	 * Toggles audio feature.
	 * 
	 * @param active boolean indicating desired state (if not specified, just flips existing state)
	 */
	const toggleAudio = useCallback(async (active?: boolean) => {
		// nothing to do if state is as desired
		if (active === syncedAudioToggledOnRef.current) {
			return;
		}

		// handles toggle audio event
		if (settings.event?.rcbToggleAudio) {
			const event = await dispatchRcbEvent(
				RcbEvent.TOGGLE_AUDIO, {
					currState: syncedAudioToggledOnRef.current,
					newState: !syncedAudioToggledOnRef.current
				}
			);
			if (event.defaultPrevented) {
				return;
			}
		}
		setSyncedAudioToggledOn(prev => !prev);
	}, [syncedAudioToggledOnRef]);

	/**
	 * Speaks out (reads aloud) a given message.
	 * 
	 * @param message message to read out
	 */
	const speakAudio = useCallback(async (text: string) => {
		if (settings.audio?.disabled || !syncedAudioToggledOnRef.current) {
			return;
		}

		let textToRead = text;
		if (settings.event?.rcbStartSpeakAudio) {
			const event = await dispatchRcbEvent(RcbEvent.START_SPEAK_AUDIO, {textToRead});
			if (event.defaultPrevented) {
				return;
			}
			textToRead = event.data.textToRead;
			
		}
		processAudio(settings, textToRead);
	}, [settings, syncedAudioToggledOnRef]);

	return {
		audioToggledOn,
		speakAudio,
		toggleAudio
	};
};
