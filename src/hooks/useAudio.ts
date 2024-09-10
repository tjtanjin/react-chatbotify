import { useCallback } from "react";

import { useRcbEventInternal } from "./internal/useRcbEventInternal";
import { useBotStatesContext } from "../context/BotStatesContext";
import { useSettingsContext } from "../context/SettingsContext";
import { RcbEvent } from "../constants/RcbEvent";

/**
 * External custom hook for managing audio.
 */
export const useAudio = () => {
	const { settings } = useSettingsContext();

	// handles bot states
	const { audioToggledOn, setAudioToggledOn } = useBotStatesContext();

	// handles rcb events
	const { callRcbEvent } = useRcbEventInternal();

	/**
	 * Toggles audio feature.
	 */
	const toggleAudio = useCallback(() => {
		setAudioToggledOn(prev => {
			// handles toggle audio event
			if (settings.event?.rcbToggleAudio) {
				const event = callRcbEvent(RcbEvent.TOGGLE_AUDIO, {currState: prev, newState: !prev});
				if (event.defaultPrevented) {
					return prev;
				}
			}
			
			return !prev
		});
	}, []);

	return {
		audioToggledOn,
		toggleAudio
	};
};
