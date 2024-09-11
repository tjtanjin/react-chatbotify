import { useCallback } from "react";

import { isChatBotVisible } from "../../utils/displayChecker";
import { useBotStatesContext } from "../../context/BotStatesContext";
import { useSettingsContext } from "../../context/SettingsContext";
import { useBotRefsContext } from "../../context/BotRefsContext";

/**
 * Internal custom hook for managing input text area.
 */
export const useTextAreaInternal = () => {
	// handles settings
	const { settings } = useSettingsContext();

	// handles bot states
	const {
		inputLength,
		setInputLength,
		textAreaDisabled,
		setTextAreaDisabled,
		textAreaSensitiveMode,
		setTextAreaSensitiveMode
	} = useBotStatesContext();

	// handles bot refs
	const { inputRef, chatBodyRef } = useBotRefsContext();

	/**
	 * Sets the text area value.
	 *
	 * @param value value to set
	 */
	const setTextAreaValue = (value: string) => {
		// todo: Checks are currently not performed and input length is also not set.
		// It should be similar to what the handleTextAreaValueChange function is doing
		// inside ChatBotInput component - a recommended approach is to centralize the
		// setting of input values into this function and then include logic checks here.
		// All other parts of the project setting input value should then call this function.

		// todo: emit rcb event once the checks above passed

		if (inputRef.current) {
			inputRef.current.value = value;
		}
	}

	/**
	 * Updates text area focus based on current block's text area.
	 * 
	 * @param currPath current path of the conversation
	 */
	const updateTextAreaFocus = useCallback((currPath: string) => {
		if (!inputRef.current?.disabled) {
			setTimeout(() => {
				if (settings.general?.embedded) {
					// for embedded chatbot, only do input focus if chatbot is still visible on page
					if (isChatBotVisible(chatBodyRef?.current as HTMLDivElement)) {
						inputRef.current?.focus();
					}
				} else {
					// prevent chatbot from forcing input focus on load
					if (currPath !== "start") {
						inputRef.current?.focus();
					}
				}
			}, 100)
		}
	}, []);

	return {
		textAreaDisabled,
		setTextAreaDisabled,
		textAreaSensitiveMode,
		setTextAreaSensitiveMode,
		inputLength,
		setInputLength,
		setTextAreaValue,
		updateTextAreaFocus
	};
};
