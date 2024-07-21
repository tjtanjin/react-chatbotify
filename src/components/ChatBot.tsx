import { useEffect, useState } from "react";

import ChatBotContainer from "./ChatBotContainer";
import { parseConfig } from "../utils/SettingsParser";
import { isDesktop } from "../utils/displayChecker";
import { BotSettingsContext } from "../context/BotSettingsContext";
import { MessagesContext } from "../context/MessagesContext";
import { PathsContext } from "../context/PathsContext";
import { BotSettings } from "../types/BotSettings";
import { BotStyles } from "../types/BotStyles";
import { Flow } from "../types/Flow";
import { Message } from "../types/Message";
import { Theme } from "../types/Theme";
import { welcomeFlow } from "../constants/internal/WelcomeFlow";
import { BotStylesContext } from "../context/BotStylesContext";

/**
 * Initializes providers for chatbot.
 *
 * @param flow conversation flow for the bot
 * @param settings settings to setup the bot
 * @param styles styles to setup the bot
 * @param themes themes to apply to the bot
 */
const ChatBot = ({
	flow,
	settings,
	styles,
	themes,
}: {
	flow?: Flow,
	settings?: BotSettings
	styles?: BotStyles,
	themes?: undefined | Theme | Array<Theme>,
}) => {

	// handles loading of chatbot only when options is loaded
	const [configLoaded, setConfigLoaded] = useState<boolean>(false);

	// handles setting of settings for the chat bot
	const [botSettings, setBotSettings] = useState<BotSettings>({});

	// handles setting of styles for the chat bot
	const [botStyles, setBotStyles] = useState<BotStyles>({});

	// handles messages between user and the chat bot
	const [messages, setMessages] = useState<Message[]>([]);

	// handles paths of the user
	const [paths, setPaths] = useState<string[]>([]);

	// provides a default welcome flow if no user flow provided
	const parsedFlow: Flow = flow ?? welcomeFlow;

	// load options on start
	useEffect(() => {
		loadConfig()
	}, []);

	/**
	 * Loads bot settings.
	 */
	const loadConfig = async () => {
		const combinedConfig = await parseConfig(settings, styles, themes);
		setBotSettings(combinedConfig.settings);
		setBotStyles(combinedConfig.styles);
		setConfigLoaded(true);
	}

	/**
	 * Wraps bot settings provider around child element.
	 * 
	 * @param children child element to wrap around
	 */
	const wrapSettingsProvider = (children: JSX.Element) => {
		return (
			<BotSettingsContext.Provider value={{botSettings, setBotSettings}}>
				{children}
			</BotSettingsContext.Provider>
		);
	};

	/**
	 * Wraps bot styles provider around child element.
	 * 
	 * @param children child element to wrap around
	 */
	const wrapStylesProvider = (children: JSX.Element) => {
		return (
			<BotStylesContext.Provider value={{botStyles, setBotStyles}}>
				{children}
			</BotStylesContext.Provider>
		);
	};


	/**
	 * Wraps paths provider around child element.
	 * 
	 * @param children child element to wrap around
	 */
	const wrapPathsProvider = (children: JSX.Element) => {
		return (
			<PathsContext.Provider value={{paths, setPaths}}>
				{children}
			</PathsContext.Provider>
		);
	};

	/**
	 * Wraps messages provider around child element.
	 * 
	 * @param children child element to wrap around
	 */
	const wrapMessagesProvider = (children: JSX.Element) => {
		return (
			<MessagesContext.Provider value={{messages, setMessages}}>
				{children}
			</MessagesContext.Provider>
		);
	};

	/**
	 * Renders chatbot with providers based on given options.
	 */
	const renderChatBot = () => {
		let result = <ChatBotContainer flow={parsedFlow}/>;
		if (!botSettings.advance?.useCustomMessages) {
			result = wrapMessagesProvider(result);
		}

		if (!botSettings.advance?.useCustomPaths) {
			result = wrapPathsProvider(result);
		}

		if (!botSettings.advance?.useCustomSettings) {
			result = wrapSettingsProvider(result);
		}

		if (!botSettings.advance?.useCustomStyles) {
			result = wrapStylesProvider(result);
		}

		return result;
	}

	/**
	 * Checks if chatbot should be shown depending on platform.
	 */
	const shouldShowChatBot = () => {
		return configLoaded && (isDesktop && botSettings.general?.desktopEnabled)
			|| (!isDesktop && botSettings.general?.mobileEnabled);
	}

	return (
		<>
			{shouldShowChatBot() &&
				<div style={{fontFamily: botSettings.general?.fontFamily}}>
					{renderChatBot()}
				</div>
			}
		</>
	);
};

export default ChatBot;