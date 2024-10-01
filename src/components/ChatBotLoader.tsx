import { Dispatch, MutableRefObject, SetStateAction, useEffect } from "react";

import { useChatBotContext } from "../context/ChatBotProvider";
import { useBotRefsContext } from "../context/BotRefsContext";
import { Settings } from "../types/Settings";
import { Styles } from "../types/Styles";
import { Flow } from "../types/Flow";
import { Theme } from "../types/Theme";

/**
 * Helps to load the chatbot configurations.
 *
 * @param id id to uniquely identify the chatbot
 * @param flow conversation flow for the bot
 * @param settings settings to setup the bot
 * @param styles styles to setup the bot
 * @param themes themes to apply to the bot
 * @param setConfigLoaded setter to indicate when config is fully loaded
 * @param shadowContainerRef ref to the shadow container
 */
const ChatBotLoader = ({
	id,
	flow,
	settings,
	styles,
	themes,
	setConfigLoaded,
	shadowContainerRef,
}: {
	id: string;
	flow: Flow;
	settings: Settings;
	styles: Styles;
	themes: Theme | Array<Theme>;
	setConfigLoaded: Dispatch<SetStateAction<boolean>>;
	shadowContainerRef: MutableRefObject<HTMLDivElement | null>;
}) => {
	// used to load config to the provider
	const chatBotContext = useChatBotContext();

	// handles bot refs
	const { flowRef } = useBotRefsContext();

	// always ensures that the ref is in sync with the latest flow
	// necessary for state updates in user-provided flows to be reflected timely
	if (flowRef.current !== flow) {
		flowRef.current = flow;
	}

	/**
	 * Loads the config file to the provider.
	 */
	const runLoadConfig = async () => {
		if (chatBotContext?.loadConfig) {
			await chatBotContext.loadConfig(id, flow, settings, styles, themes, shadowContainerRef);
			setConfigLoaded(true);
		}
	}

	useEffect(() => {
		runLoadConfig();
	}, []);

	return null;
};

export default ChatBotLoader;