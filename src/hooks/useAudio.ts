import { useAudioInternal } from "./internal/useAudioInternal";

/**
 * External custom hook for managing audio.
 */
export const useAudio = () => {
	// handles audio
	const { audioToggledOn, speakAudio, toggleAudio } = useAudioInternal();

	return {
		audioToggledOn,
		speakAudio,
		toggleAudio
	};
};
