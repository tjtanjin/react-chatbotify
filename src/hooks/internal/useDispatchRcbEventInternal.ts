import { useCallback } from "react";

import { emitRcbEvent } from "../../services/RcbEventService";
import { useBotRefsContext } from "../../context/BotRefsContext";
import { RcbEvent } from "../../constants/RcbEvent";
import { usePathsContext } from "../../context/PathsContext";

/**
 * Internal custom hook for managing firing of rcb events.
 */
export const useDispatchRcbEventInternal = () => {
	// handles bot refs
	const { botIdRef } = useBotRefsContext();

	// handles paths
	const { syncedPathsRef } = usePathsContext();

	/**
	 * Retrieves current path for user. Note that this function is duplicated from usePathsInternal
	 * to avoid issues with circular imports. We still need this function since events are designed
	 * to supply path details by default.
	 */
	const getCurrPath = useCallback(() => {
		return syncedPathsRef.current.length > 0 ? syncedPathsRef.current.at(-1) ?? null : null;
	}, []);

	/**
	 * Retrieves previous path for user. Note that this function is duplicated from usePathsInternal
	 * to avoid issues with circular imports. We still need this function since events are designed
	 * to supply path details by default.
	 */
	const getPrevPath = useCallback(() => {
		return syncedPathsRef.current.length > 1 ? syncedPathsRef.current.at(-2) ?? null : null;
	}, []);

	/**
	 * Consolidates the information required to call and emit a specific event.
	 *
	 * @param eventName name of the event to prepare and call
	 * @param data additional data to include with the event
	 */
	const dispatchRcbEvent = useCallback(async (eventName: RcbEvent, data: object) => {
		const details = {botId: botIdRef.current, currPath: getCurrPath(), prevPath: getPrevPath()}
		return await emitRcbEvent(eventName, details, data);
	}, [botIdRef])

	return { dispatchRcbEvent };
};
