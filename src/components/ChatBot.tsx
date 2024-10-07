import { useMemo, useRef, useState } from "react";

import ChatBotContainer from "./ChatBotContainer";
import ChatBotLoader from "./ChatBotLoader";
import { generateSecureUUID } from "../utils/idGenerator";
import ChatBotProvider, { useChatBotContext } from "../context/ChatBotContext";
import { Settings } from "../types/Settings";
import { Styles } from "../types/Styles";
import { Flow } from "../types/Flow";
import { Theme } from "../types/Theme";
import { Plugin } from "../types/Plugin";
import { WelcomeFlow } from "../constants/internal/WelcomeFlow";

/**
 * Determines if user gave a provider or if one needs to be created, before rendering the chatbot.
 *
 * @param id id to uniquely identify the chatbot
 * @param flow conversation flow for the bot
 * @param settings settings to setup the bot
 * @param styles styles to setup the bot
 * @param themes themes to apply to the bot
 * @param plugins plugins to initialize
 */
const ChatBot = ({
	id,
	flow,
	settings,
	styles,
	themes = [],
	plugins = []
}: {
	id?: string;
	flow?: Flow;
	settings?: Settings;
	styles?: Styles;
	themes?: Theme | Array<Theme>;
	plugins?: Array<Plugin>;
}) => {

	// handles cases where any props are empty
	const finalBotId = useMemo(() => id || "rcb-" + generateSecureUUID(), []);
	const finalFlow = (!flow || Object.keys(flow).length === 0) ? WelcomeFlow : flow;
	const finalSettings = !settings ? {} : settings;
	const finalStyles = !styles ? {} : styles;

	// handles loading of chatbot only when config is loaded
	const [configLoaded, setConfigLoaded] = useState<boolean>(false);
	
	// used to determine if users provided their own chatbotprovider
	const chatBotContext = useChatBotContext();

	// handles style root container ref
	const styleRootRef = useRef<HTMLStyleElement | null>(null);

	/**
	 * Renders chatbot with provider depending on whether one was provided by the user.
	 */
	const renderChatBot = () => (
		<>
			<ChatBotLoader styleRootRef={styleRootRef} id={finalBotId} flow={finalFlow} settings={finalSettings}
				styles={finalStyles} themes={themes} plugins={plugins} setConfigLoaded={setConfigLoaded}
			/>
			{configLoaded && <ChatBotContainer plugins={plugins} />}
		</>
	)

	return (
		chatBotContext == null ? ( 
			<ChatBotProvider>
				<style ref={styleRootRef}/>
				<div id={finalBotId}>{renderChatBot()}</div>
			</ChatBotProvider>
		) : (
			<>
				<style ref={styleRootRef}/>
				<div id={finalBotId}>{renderChatBot()}</div>
			</>
		)
	)
};

export default ChatBot;