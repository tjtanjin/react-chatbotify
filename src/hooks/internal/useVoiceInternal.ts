import { useCallback } from "react";

import { useDispatchRcbEventInternal } from "./useDispatchRcbEventInternal";
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
	const { voiceToggledOn, setSyncedVoiceToggledOn, syncedVoiceToggledOnRef } = useBotStatesContext();

	// handles rcb events
	const { dispatchRcbEvent } = useDispatchRcbEventInternal();

	/**
	 * Toggles voice feature.
	 * 
	 * @param active boolean indicating desired state (if not specified, just flips existing state)
	 */
	const toggleVoice = useCallback(async (active?: boolean) => {
		// nothing to do if state is as desired
		if (active === syncedVoiceToggledOnRef.current) {
			return;
		}

		// handles toggle voice event
		if (settings.event?.rcbToggleVoice) {
			const event = await dispatchRcbEvent(
				RcbEvent.TOGGLE_VOICE, {
					currState: syncedVoiceToggledOnRef.current,
					newState: !syncedVoiceToggledOnRef.current
				}
			);
			if (event.defaultPrevented) {
				return;
			}
		}
		setSyncedVoiceToggledOn(prev => !prev);
	}, [syncedVoiceToggledOnRef]);

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
