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
		setSyncedTextAreaDisabled,
		textAreaSensitiveMode,
		setSyncedTextAreaSensitiveMode,
		syncedTextAreaDisabledRef,
		syncedTextAreaSensitiveModeRef,
	} = useBotStatesContext();

	// handles bot refs
	const { inputRef, chatBodyRef, prevInputRef } = useBotRefsContext();

	// handles rcb events
	const { dispatchRcbEvent } = useRcbEventInternal();

	/**
	 * Sets the text area value.
	 *
	 * @param value value to set
	 */
	const setTextAreaValue = useCallback(async (value: string): Promise<void> => {
		if (syncedTextAreaDisabledRef.current && inputRef.current) {
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
				const event = await dispatchRcbEvent(
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
	}, [syncedTextAreaDisabledRef, inputRef, prevInputRef, settings, dispatchRcbEvent])

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
		if (inputRef.current) {
			inputRef.current.focus();
		}
	}, []);

	/**
	 * Blurs on text area.
	 */
	const blurTextArea = useCallback(() => {
		if (inputRef.current) {
			inputRef.current.blur();
		}
	}, []);
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
	 * 
	 * @param active boolean indicating desired state (if not specified, just flips existing state)
	 */
	const toggleTextAreaDisabled = useCallback((active?: boolean) => {
		// nothing to do if state is as desired
		if (active === syncedTextAreaDisabledRef.current) {
			return;
		}

		setSyncedTextAreaDisabled(prev => !prev);
	}, [syncedTextAreaDisabledRef])

	/**
	 * Toggles text area sensitive mode.
	 * 
	 * @param active boolean indicating desired state (if not specified, just flips existing state)
	 */
	const toggleTextAreaSensitiveMode = useCallback((active?: boolean) => {
		// nothing to do if state is as desired
		if (active === syncedTextAreaSensitiveModeRef.current) {
			return;
		}

		setSyncedTextAreaSensitiveMode(prev => !prev);
	}, [syncedTextAreaSensitiveModeRef])

	// todo: we can just standardize to export and use toggles, clean up in future
	return {
		textAreaDisabled,
		setSyncedTextAreaDisabled,
		textAreaSensitiveMode,
		setSyncedTextAreaSensitiveMode,
		inputLength,
		setInputLength,
		getTextAreaValue,
		setTextAreaValue,
		updateTextAreaFocus,
		focusTextArea,
		blurTextArea,
		toggleTextAreaDisabled,
		toggleTextAreaSensitiveMode
	};
};