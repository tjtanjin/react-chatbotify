import { useCallback } from 'react';

import { emitRcbEvent } from '../../services/RcbEventService';
import { usePathsContext } from '../../context/PathsContext';
import { useSettingsContext } from '../../context/SettingsContext';
import { useStylesContext } from '../../context/StylesContext';
import { useMessagesContext } from '../../context/MessagesContext';
import { useBotStatesContext } from '../../context/BotStatesContext';
import { Flow } from '../../types/Flow';
import { RcbEvent } from '../../constants/RcbEvent';

/**
 * Internal custom hook to handle paths in the chatbot conversation flow.
 */
export const usePathsInternal = () => {
	// handles settings
	const { settings } = useSettingsContext();

	// handles styles
	const { styles } = useStylesContext();

	// handles messages
	const { messages } = useMessagesContext();

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
	const goToPath = useCallback((pathToGo: keyof Flow): boolean => {
		// handles path change event
		// note that this doesn't use callRcbEvent to avoid circular imports
        if (settings.event?.rcbChangePath) {
            const currPath = getCurrPath();
            const prevPath = getPrevPath();
            const details = {currPath, prevPath}
            event = emitRcbEvent(RcbEvent.CHANGE_PATH, details, {currPath, prevPath, nextPath: pathToGo},
				settings, styles, messages, paths
			);
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

	return {
		getCurrPath,
		getPrevPath,
		goToPath,
		blockAllowsAttachment,
		setBlockAllowsAttachment,
		paths,
		setPaths
	};
};
