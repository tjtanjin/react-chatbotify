import { useCallback } from "react";

import { emitRcbEvent } from "../../services/RcbEventService";
import { useBotRefsContext } from "../../context/BotRefsContext";
import { RcbEvent } from "../../constants/RcbEvent";

/**
 * Internal custom hook for managing firing of rcb events.
 */
export const useRcbEventInternal = () => {
	// handles paths
	const { pathsRef } = useBotRefsContext();

	/**
	 * Retrieves current path for user. Note that this function is duplicated from usePathsInternal
	 * to avoid issues with circular imports. We still need this function since events are designed
	 * to supply path details by default.
	 */
	const getCurrPath = useCallback(() => {
		return pathsRef.current.length > 0 ? pathsRef.current.at(-1) ?? null : null;
	}, []);

	/**
	 * Retrieves previous path for user. Note that this function is duplicated from usePathsInternal
	 * to avoid issues with circular imports. We still need this function since events are designed
	 * to supply path details by default.
	 */
	const getPrevPath = useCallback(() => {
		return pathsRef.current.length > 1 ? pathsRef.current.at(-2) ?? null : null;
	}, []);

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
	}, [botIdRef])

	return { callRcbEvent };
};
