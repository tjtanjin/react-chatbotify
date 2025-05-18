import { useCallback } from "react";

import { usePathsContext } from "../../context/PathsContext";
import { useBotRefsContext } from "../../context/BotRefsContext";
import { useSettingsContext } from "../../context/SettingsContext";
import { useBotStatesContext } from "../../context/BotStatesContext";
import { Flow } from "../../types/Flow";
import { RcbEvent } from "../../constants/RcbEvent";
import { useMessagesInternal } from "./useMessagesInternal";
import { useVoiceInternal } from "./useVoiceInternal";
import { useTextAreaInternal } from "./useTextAreaInternal";
import { useChatWindowInternal } from "./useChatWindowInternal";
import { useToastsInternal } from "./useToastsInternal";
import { preProcessBlock } from "../../services/BlockService/BlockService";
import { useDispatchRcbEventInternal } from "./useDispatchRcbEventInternal";
import { Block } from "../../types/Block";

/**
 * Internal custom hook to handle paths in the chatbot conversation flow.
 */
export const usePathsInternal = () => {
	// handles settings
	const { settings } = useSettingsContext();

	// handles paths
	const { paths, setSyncedPaths, syncedPathsRef } = usePathsContext();

	// handles bot refs
	const { flowRef, streamMessageMap, paramsInputRef, keepVoiceOnRef, timeoutIdRef } = useBotRefsContext();

	// handles bot states
	const {
		setSyncedIsBotTyping,
		setSyncedTextAreaDisabled,
		setSyncedTextAreaSensitiveMode,
		blockAllowsAttachment,
		setBlockAllowsAttachment,
	} = useBotStatesContext();

	// handles rcb events
	const { dispatchRcbEvent } = useDispatchRcbEventInternal();

	// handles messages
	const {
		endStreamMessage,
		injectMessage,
		removeMessage,
		simulateStreamMessage,
		streamMessage,
	} = useMessagesInternal();

	// handles toast
	const { showToast, dismissToast } = useToastsInternal();

	// handles chat window
	const { toggleChatWindow } = useChatWindowInternal();

	// handles input text area
	const { updateTextAreaFocus, setTextAreaValue } = useTextAreaInternal();

	// handles voice
	const { syncVoice } = useVoiceInternal();

	/**
	 * Callback function for emitting post-process block event.
	 * 
	 * @param block block that is being post-processed
	 */
	const firePostProcessBlockEvent = useCallback(async (block: Block): Promise<Block | null> => {
		if (settings.event?.rcbPostProcessBlock) {
			const event = await dispatchRcbEvent(RcbEvent.POST_PROCESS_BLOCK, {
				block,
			});
			if (event.defaultPrevented) {
				return null;
			}
			block = event.data.block;
		}
		return block;
	}, [settings.event?.rcbPostProcessBlock, dispatchRcbEvent])

	/**
	 * Handles processing of new block upon path change.
	 *
	 * @param currPath current path user is in
	 * @param prevPath previous path user came from
	 */
	const handlePathChange = useCallback(async (
		currPath: string | null,
		prevPath: string | null
	) => {
		if (!currPath) {
			return;
		}

		// if block is invalid, nothing to process (i.e. becomes dead end!)
		let block = (flowRef.current as Flow)[currPath];
		if (!block) {
			setSyncedIsBotTyping(false);
			return;
		}
	
		if (settings.event?.rcbPreProcessBlock) {
			const event = await dispatchRcbEvent(RcbEvent.PRE_PROCESS_BLOCK, {
				block,
			});
			if (event.defaultPrevented) {
				return;
			}
			block = event.data.block;
		}

		// ***** start of preprocessing logic *****

		setSyncedIsBotTyping(true);
		if (settings.chatInput?.blockSpam) {
			setSyncedTextAreaDisabled(true);
		}
		setSyncedTextAreaSensitiveMode(false);

		const params = {
			prevPath,
			currPath,
			goToPath,
			setTextAreaValue,
			userInput: paramsInputRef.current,
			endStreamMessage,
			injectMessage,
			removeMessage,
			simulateStreamMessage,
			streamMessage,
			toggleChatWindow,
			showToast,
			dismissToast
		};
		await preProcessBlock(
			block,
			params,
			settings.botBubble?.simulateStream ?? false,
			timeoutIdRef,
			setSyncedTextAreaDisabled,
			setSyncedTextAreaSensitiveMode,
			firePostProcessBlockEvent,
		);
	
		// cleanup logic after preprocessing of a block
		setSyncedIsBotTyping(false);
	
		if (!("chatDisabled" in block)) {
			setSyncedTextAreaDisabled(settings.chatInput?.disabled as boolean);
		}
	
		if (!("isSensitive" in block)) {
			setSyncedTextAreaSensitiveMode(false);
		}
	
		setBlockAllowsAttachment(typeof block.file === "function");
		updateTextAreaFocus(currPath);
		syncVoice(keepVoiceOnRef.current && !block.chatDisabled);
	
		// auto cleanup streaming and save messages on path change (not ideal)
		// todo: remove this in v3, users should call `params.endStreamMessage()`
		if (currPath !== prevPath) {
			streamMessageMap.current.clear();
		}

		// ***** end of preprocessing logic *****
	}, [
		flowRef,
		updateTextAreaFocus,
		syncVoice,
		settings.botBubble?.simulateStream,
		settings.chatInput?.disabled,
		paramsInputRef,
		endStreamMessage,
		injectMessage,
		removeMessage,
		simulateStreamMessage,
		streamMessage,
		toggleChatWindow,
		showToast,
		dismissToast,
		keepVoiceOnRef,
		streamMessageMap,
	]);

	/**
	 * Retrieves current path for user.
	 */
	const getCurrPath = useCallback(() => {
		return syncedPathsRef.current.length > 0 ? syncedPathsRef.current.at(-1) ?? null : null;
	}, []);

	/**
	 * Retrieves previous path for user.
	 */
	const getPrevPath = useCallback(() => {
		return syncedPathsRef.current.length > 1 ? syncedPathsRef.current.at(-2) ?? null : null;
	}, []);

	/**
	 * Handles going directly to a path, while mimicking post-processing behaviors.
	 *
	 * @param pathToGo The path to go to in the conversation flow.
	 */
	const goToPath = useCallback(async (pathToGo: keyof Flow): Promise<boolean> => {
		const currPath = getCurrPath();
		const prevPath = getPrevPath();

		// handles path change event
		if (settings.event?.rcbChangePath) {
			const event = await dispatchRcbEvent(RcbEvent.CHANGE_PATH, {
				currPath,
				prevPath,
				nextPath: pathToGo,
			});
			if (event.defaultPrevented) {
				return false;
			}
		}

		// update paths and trigger path change handling
		setSyncedPaths(prev => [...prev, pathToGo]);

		await handlePathChange(pathToGo, currPath);
		return true;
	}, [settings.chatInput?.blockSpam, settings.event?.rcbChangePath, handlePathChange, dispatchRcbEvent]);

	/**
	 * Replaces (overwrites entirely) the current paths with the new paths.
	 * Note that this does not trigger handlePathChange and that goToPath is the only
	 * valid approach for triggering path processing behavior.
	 * 
	 * @param newPaths new paths to set/replace
	 */
	const replacePaths = useCallback((newPaths: Array<string>) => {
		setSyncedPaths(newPaths);
	}, []);

	return {
		getCurrPath,
		getPrevPath,
		goToPath,
		blockAllowsAttachment,
		setBlockAllowsAttachment,
		paths,
		replacePaths,
		firePostProcessBlockEvent,
	};
};
