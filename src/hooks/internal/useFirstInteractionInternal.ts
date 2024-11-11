import { useCallback } from "react";

import { useSettingsContext } from "../../context/SettingsContext";
import { useBotStatesContext } from "../../context/BotStatesContext";

/**
 * Internal custom hook for managing user first interaction.
 */
export const useFirstInteractionInternal = () => {
	// handles settings
	const { settings } = useSettingsContext();

	// handles bot states
	const { hasInteractedPage, setHasInteractedPage, hasFlowStarted, setHasFlowStarted } = useBotStatesContext();
	
	/**
	 * Checks for initial user interaction (required to play audio/notification sound).
	 */
	const handleFirstInteraction = useCallback(() => {
		setHasInteractedPage(true);
		if (!hasFlowStarted && settings.general?.flowStartTrigger === "ON_PAGE_INTERACT") {
			setHasFlowStarted(true);
		}

		if (!window.SpeechSynthesisUtterance) {
			console.info("Speech Synthesis API is not supported in this environment.");
			return;
		}

		// workaround for getting audio to play on mobile
		const utterance = new window.SpeechSynthesisUtterance();
		utterance.text = "";
		utterance.onend = () => {
			window.removeEventListener("click", handleFirstInteraction);
			window.removeEventListener("keydown", handleFirstInteraction);
			window.removeEventListener("touchstart", handleFirstInteraction);
		};
		window.speechSynthesis.speak(utterance);
	}, [hasFlowStarted, settings.general?.flowStartTrigger]);

	return {
		hasInteractedPage,
		handleFirstInteraction
	};
};
