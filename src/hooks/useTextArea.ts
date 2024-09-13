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
		setTextAreaDisabled,
		textAreaSensitiveMode,
		setTextAreaSensitiveMode,
		setTextAreaValue
	} = useTextAreaInternal();

	/**
	 * Focuses on text area.
	 */
	const focusTextArea = useCallback(() => {
		if (!textAreaDisabled && inputRef.current) {
			inputRef.current.focus();
		}
	}, [textAreaDisabled]);

	/**
	 * Retrieves text area value.
	 */
	const getTextAreaValue = useCallback(() => {
		return inputRef.current?.value;
	}, [inputRef.current]);

	/**
	 * Toggles text area disabled.
	 */
	const toggleTextAreaDisabled = () => {
		setTextAreaDisabled(prev => !prev);
	}

	/**
	 * Toggles text area sensitive mode.
	 */
	const toggleTextAreaSensitiveMode = () => {
		setTextAreaSensitiveMode(prev => !prev);
	}

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
