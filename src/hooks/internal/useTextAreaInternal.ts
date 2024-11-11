import { useCallback } from "react";

import { isChatBotVisible } from "../../utils/displayChecker";
import { useBotStatesContext } from "../../context/BotStatesContext";
import { useSettingsContext } from "../../context/SettingsContext";
import { useBotRefsContext } from "../../context/BotRefsContext";
import { useRcbEventInternal } from "./useRcbEventInternal";
import { RcbEvent } from "../../constants/RcbEvent";

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
	const { inputRef, chatBodyRef, prevInputRef } = useBotRefsContext();

	// handles rcb events
	const { callRcbEvent } = useRcbEventInternal();

	/**
	 * Sets the text area value.
	 *
	 * @param value value to set
	 */
	const setTextAreaValue = useCallback(async (value: string): Promise<void> => {
		if (textAreaDisabled && inputRef.current) {
			// prevent input and keep current value
			inputRef.current.value = "";
			return;
		}

		if (inputRef.current && prevInputRef.current !== null) {
			const characterLimit = settings.chatInput?.characterLimit
			/*
			* @params allowNewline Boolean
			* allowNewline [true] Allow input values to contain line breaks "\n"
			* allowNewline [false] Replace \n with a space
			* */
			const allowNewline = settings.chatInput?.allowNewline
			const newInput = allowNewline ? value : value.replace(/\n/g, " ");
			if (characterLimit != null && characterLimit >= 0 && newInput.length > characterLimit) {
				inputRef.current.value = newInput.slice(0, characterLimit);
			} else {
				inputRef.current.value = newInput
			}

			// handles text area change value event
			if (settings.event?.rcbTextAreaChangeValue) {
				const event = await callRcbEvent(
					RcbEvent.TEXT_AREA_CHANGE_VALUE,
					{currValue: inputRef.current.value, prevValue: prevInputRef.current}
				);
				if (event.defaultPrevented) {
					inputRef.current.value = prevInputRef.current;
					return 
				}
			}
			prevInputRef.current = inputRef.current.value;
		}
	}, [textAreaDisabled, inputRef, prevInputRef, settings, callRcbEvent])

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
		if (inputRef && inputRef.current) {
			return inputRef.current.value;
		}
		return "";
	}, []);

	/**
	 * Toggles text area disabled.
	 */
	const toggleTextAreaDisabled = useCallback(() => {
		setTextAreaDisabled(prev => !prev);
	}, [])

	/**
	 * Toggles text area sensitive mode.
	 */
	const toggleTextAreaSensitiveMode = useCallback(() => {
		setTextAreaSensitiveMode(prev => !prev);
	}, [])

	// todo: we can just standardize to export and use toggles, clean up in future
	return {
		textAreaDisabled,
		setTextAreaDisabled,
		textAreaSensitiveMode,
		setTextAreaSensitiveMode,
		inputLength,
		setInputLength,
		getTextAreaValue,
		setTextAreaValue,
		updateTextAreaFocus,
		focusTextArea,
		toggleTextAreaDisabled,
		toggleTextAreaSensitiveMode
	};
};
