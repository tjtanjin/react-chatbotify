import { useCallback } from "react";

import { emitRcbEvent } from "../../services/RcbEventService";
import { usePaths } from "../usePaths";
import { useBotRefsContext } from "../../context/BotRefsContext";
import { RcbEvent } from "../../constants/RcbEvent";

/**
 * Internal custom hook for managing firing of rcb events.
 */
export const useRcbEventInternal = () => {
	// handles paths
	const { getCurrPath, getPrevPath, paths } = usePaths();

	// handles bot refs
	const { botIdRef } = useBotRefsContext();

	/**
	 * Consolidates the information required to call and emit a specific event.
	 *
	 * @param eventName name of the event to prepare and call
	 * @param data additional data to include with the event
	 */
	const callRcbEvent = useCallback(async (eventName: typeof RcbEvent[keyof typeof RcbEvent], data: object) => {
		const details = {botId: botIdRef.current, currPath: getCurrPath(), prevPath: getPrevPath()}
		return await emitRcbEvent(eventName, details, data);
	}, [paths])

	return { callRcbEvent };
};
