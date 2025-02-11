import { useTextAreaInternal } from "./internal/useTextAreaInternal";

/**
 * External custom hook for managing input text area.
 */
export const useTextArea = () => {
	// handles input text area
	const {
		textAreaDisabled,
		toggleTextAreaDisabled,
		textAreaSensitiveMode,
		toggleTextAreaSensitiveMode,
		getTextAreaValue,
		setTextAreaValue,
		focusTextArea,
		blurTextArea
	} = useTextAreaInternal();

	return {
		textAreaDisabled,
		toggleTextAreaDisabled,
		textAreaSensitiveMode,
		toggleTextAreaSensitiveMode,
		getTextAreaValue,
		setTextAreaValue,
		focusTextArea,
		blurTextArea
	};
};