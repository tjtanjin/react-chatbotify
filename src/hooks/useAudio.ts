import { useAudioInternal } from "./internal/useAudioInternal";

/**
 * External custom hook for managing audio.
 */
export const useAudio = () => {
	// handles audio
	const { audioToggledOn, toggleAudio } = useAudioInternal();

	return {
		audioToggledOn,
		toggleAudio
	};
};
