import { useCallback } from "react";

import { useRcbEventInternal } from "./useRcbEventInternal";
import { syncVoiceWithChatInput } from "../../services/VoiceService";
import { useSettingsContext } from "../../context/SettingsContext";
import { useBotStatesContext } from "../../context/BotStatesContext";
import { RcbEvent } from "../../constants/RcbEvent";

/**
 * Internal custom hook for managing voice.
 */
export const useVoiceInternal = () => {
	// handles settings
	const { settings } = useSettingsContext();

	// handles bot states
	const { voiceToggledOn, setVoiceToggledOn } = useBotStatesContext();

	// handles rcb events
	const { callRcbEvent } = useRcbEventInternal();

	/**
	 * Toggles voice feature.
	 */
	const toggleVoice = useCallback(async () => {
		// handles toggle voice event
		if (settings.event?.rcbToggleVoice) {
			const event = await callRcbEvent(
				RcbEvent.TOGGLE_VOICE, {currState: voiceToggledOn, newState: !voiceToggledOn}
			);
			if (event.defaultPrevented) {
				return;
			}
		}
		setVoiceToggledOn(prev => !prev);
	}, [voiceToggledOn]);

	/**
	 * Sync voice with chat input based on whether voice should be kept toggled on.
	 * 
	 * @param keepVoiceOn boolean indicating if voice should be kept toggled on
	 */
	const syncVoice = useCallback((keepVoiceOn: boolean) => {
		syncVoiceWithChatInput(keepVoiceOn, settings);
	}, [settings]);

	return {
		voiceToggledOn,
		toggleVoice,
		syncVoice
	};
};
