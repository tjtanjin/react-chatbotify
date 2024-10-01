import { useCallback } from "react";

import { useTextAreaInternal } from "./internal/useTextAreaInternal";
import { useBotRefsContext } from "../context/BotRefsContext";

/**
 * External custom hook for managing input text area.
 */
export const useTextArea = () => {
	const { inputRef } = useBotRefsContext();

	// handles input text area
	const {
		textAreaDisabled,
		toggleTextAreaDisabled,
		textAreaSensitiveMode,
		toggleTextAreaSensitiveMode,
		getTextAreaValue,
		setTextAreaValue,
		focusTextArea
	} = useTextAreaInternal();

	return {
		textAreaDisabled,
		toggleTextAreaDisabled,
		textAreaSensitiveMode,
		toggleTextAreaSensitiveMode,
		getTextAreaValue,
		setTextAreaValue,
		focusTextArea
	};
};
