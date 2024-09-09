import { useVoiceInternal } from "./internal/useVoiceInternal";

/**
 * External custom hook for managing voice.
 */
export const useVoice = () => {
	// handles voice
	const { voiceToggledOn, toggleVoice } = useVoiceInternal();

	return {
		voiceToggledOn,
		toggleVoice
	};
};
