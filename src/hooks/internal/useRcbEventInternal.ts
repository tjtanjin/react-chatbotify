import { useCallback } from "react";

import { emitRcbEvent } from "../../services/RcbEventService";
import { usePaths } from "../usePaths";
import { useSettingsContext } from "../../context/SettingsContext";
import { useStylesContext } from "../../context/StylesContext";
import { useMessagesContext } from "../../context/MessagesContext";
import { RcbEvent } from "../../constants/RcbEvent";

/**
 * Internal custom hook for managing firing of rcb events.
 */
export const useRcbEventInternal = () => {
	// handles settings
	const { settings } = useSettingsContext();

	// handles styles
	const { styles } = useStylesContext();

	// handles messages
	const { messages } = useMessagesContext();

	// handles paths
	const { getCurrPath, getPrevPath, paths } = usePaths();

	/**
	 * Consolidates the information required to call and emit a specific event.
	 *
	 * @param eventName name of the event to prepare and call
	 * @param data additional data to include with the event
	 */
	const callRcbEvent = useCallback((eventName: typeof RcbEvent[keyof typeof RcbEvent], data: object) => {
		const details = {currPath: getCurrPath(), prevPath: getPrevPath()}
		return emitRcbEvent(eventName, details, data, settings, styles, messages, paths);
	}, [paths])

	return { callRcbEvent };
};
