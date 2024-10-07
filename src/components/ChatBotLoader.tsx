import { Dispatch, MutableRefObject, SetStateAction, useEffect, useMemo } from "react";

import { emitRcbEvent } from "../services/RcbEventService";
import { useChatBotContext } from "../context/ChatBotContext";
import { useBotRefsContext } from "../context/BotRefsContext";
import { Settings } from "../types/Settings";
import { Styles } from "../types/Styles";
import { Flow } from "../types/Flow";
import { Theme } from "../types/Theme";
import { Plugin } from "../types/Plugin";
import { RcbEvent } from "../constants/RcbEvent";

/**
 * Helps to load the chatbot configurations.
 *
 * @param id id to uniquely identify the chatbot
 * @param flow conversation flow for the bot
 * @param settings settings to setup the bot
 * @param styles styles to setup the bot
 * @param themes themes to apply to the bot
 * @param setConfigLoaded setter to indicate when config is fully loaded
 * @param styleRootRef ref to the style container
 */
const ChatBotLoader = ({
	id,
	flow,
	settings,
	styles,
	themes,
	plugins,
	setConfigLoaded,
	styleRootRef,
}: {
	id: string;
	flow: Flow;
	settings: Settings;
	styles: Styles;
	themes: Theme | Array<Theme>;
	plugins: Array<Plugin>;
	setConfigLoaded: Dispatch<SetStateAction<boolean>>;
	styleRootRef: MutableRefObject<HTMLStyleElement | null>;
}) => {
	// memoized chatbot id
	const memoizedId = useMemo(() => id, []);

	// used to load config to the provider
	const chatBotContext = useChatBotContext();

	// handles bot refs
	const { flowRef } = useBotRefsContext();

	// always ensures that the ref is in sync with the latest flow
	// necessary for state updates in user-provided flows to be reflected timely
	if (flowRef && flowRef.current !== flow) {
		flowRef.current = flow;
	}

	/**
	 * Loads the config file to the provider.
	 */
	const runLoadConfig = async () => {
		// handles pre load chatbot event
		if (settings.event?.rcbPreLoadChatBot) {
			const event = emitRcbEvent(RcbEvent.PRE_LOAD_CHATBOT, {botId: memoizedId, currPath: null, prevPath: null}, 
				{
					flow,
					settings,
					styles,
					themes,
					plugins
				}
			);
			if (event.defaultPrevented) {
				return;
			}
		}

		if (chatBotContext?.loadConfig) {
			await chatBotContext.loadConfig(memoizedId, flow, settings, styles, themes, styleRootRef);
			setConfigLoaded(true);
		}

		// handles post load chatbot event
		if (settings.event?.rcbPostLoadChatBot) {
			emitRcbEvent(RcbEvent.POST_LOAD_CHATBOT, {botId: memoizedId, currPath: null, prevPath: null}, 
				{
					flow,
					settings,
					styles,
					themes,
					plugins
				}
			);
		}
	}

	useEffect(() => {
		runLoadConfig();
	}, [themes]);

	return null;
};

export default ChatBotLoader;