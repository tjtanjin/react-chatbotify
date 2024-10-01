import { useCallback } from "react";

import { useRcbEventInternal } from "./useRcbEventInternal";
import { useBotStatesContext } from "../../context/BotStatesContext";
import { useSettingsContext } from "../../context/SettingsContext";
import { RcbEvent } from "../../constants/RcbEvent";

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
	 */
	const toggleAudio = useCallback(() => {
		// handles toggle audio event
		if (settings.event?.rcbToggleAudio) {
			const event = callRcbEvent(RcbEvent.TOGGLE_AUDIO, {currState: audioToggledOn, newState: !audioToggledOn});
			if (event.defaultPrevented) {
				return;
			}
		}
		setAudioToggledOn(prev => !prev);
	}, []);

	return {
		audioToggledOn,
		toggleAudio
	};
};
