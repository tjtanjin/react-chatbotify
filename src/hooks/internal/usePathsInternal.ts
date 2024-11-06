import { useCallback } from "react";

import { emitRcbEvent } from "../../services/RcbEventService";
import { usePathsContext } from "../../context/PathsContext";
import { useBotRefsContext } from "../../context/BotRefsContext";
import { useSettingsContext } from "../../context/SettingsContext";
import { useBotStatesContext } from "../../context/BotStatesContext";
import { Flow } from "../../types/Flow";
import { RcbEvent } from "../../constants/RcbEvent";

/**
 * Internal custom hook to handle paths in the chatbot conversation flow.
 */
export const usePathsInternal = () => {
	// handles settings
	const { settings } = useSettingsContext();

	// handles paths
	const { paths, setPaths } = usePathsContext();

	// handles bot states
	const {
		setIsBotTyping,
		setTextAreaDisabled,
		setTextAreaSensitiveMode,
		blockAllowsAttachment,
		setBlockAllowsAttachment
	} = useBotStatesContext();

	// handles bot refs
	const { botIdRef } = useBotRefsContext();

	/**
	 * Retrieves current path for user.
	 */
	const getCurrPath = useCallback(() => {
		return paths.length > 0 ? paths[paths.length - 1] : null;
	}, [paths])

	/**
	 * Retrieves previous path for user.
	 */
	const getPrevPath = useCallback(() => {
		return paths.length > 1 ? paths[paths.length - 2] : null;
	}, [paths])

	/**
	 * Handles going directly to a path, while mimicking post-processing behaviors.
	 *
	 * @param pathToGo The path to go to in the conversation flow.
	 */
	const goToPath = useCallback(async (pathToGo: keyof Flow): Promise<boolean> => {
		// handles path change event
		// note that this doesn't use callRcbEvent to avoid circular imports
		if (settings.event?.rcbChangePath) {
			const currPath = getCurrPath();
			const prevPath = getPrevPath();
			const details = {botId: botIdRef.current, currPath, prevPath}
			event = await emitRcbEvent(RcbEvent.CHANGE_PATH, details, {currPath, prevPath, nextPath: pathToGo});
			if (event.defaultPrevented) {
				return false;
			}
		}

		// mimics post-processing behavior
		setIsBotTyping(true);
		if (settings.chatInput?.blockSpam) {
			setTextAreaDisabled(true);
		}
		setTextAreaSensitiveMode(false);

		// go to specified path
		setPaths((prev) => [...prev, pathToGo]);
		return true;
	}, [paths, setPaths, settings]);

	/**
	 * Replaces (overwrites entirely) the current paths with the new paths.
	 */
	const replacePaths = useCallback((newPaths: Array<string>) => {
		setPaths(newPaths);
	}, [])

	return {
		getCurrPath,
		getPrevPath,
		goToPath,
		blockAllowsAttachment,
		setBlockAllowsAttachment,
		paths,
		replacePaths
	};
};
