import { useEffect, useState } from "react";

import ChatBotContainer from "./ChatBotContainer";
import { parseSettings } from "../utils/SettingsParser";
import { isDesktop } from "../utils/displayChecker";
import { BotSettingsContext } from "../context/BotSettingsContext";
import { MessagesContext } from "../context/MessagesContext";
import { PathsContext } from "../context/PathsContext";
import { Settings } from "../types/Settings";
import { Flow } from "../types/Flow";
import { Message } from "../types/Message";
import { Theme } from "../types/Theme";
import { welcomeFlow } from "../constants/internal/WelcomeFlow";

/**
 * Initializes providers for chatbot.
 *
 * @param flow conversation flow for the bot
 * @param botSettings settings to setup the bot
 * @param themes themes to apply to the bot
 */
const ChatBot = ({
	flow,
	settings,
	themes,
}: {
	flow?: Flow,
	settings?: Settings
	themes?: undefined | Theme | Array<Theme>,
}) => {

	// handles loading of chatbot only when options is loaded
	const [settingsLoaded, setSettingsLoaded] = useState<boolean>(false);

	// handles setting of options for the chat bot
	const [botSettings, setBotSettings] = useState<Settings>({});

	// handles messages between user and the chat bot
	const [messages, setMessages] = useState<Message[]>([]);

	// handles paths of the user
	const [paths, setPaths] = useState<string[]>([]);

	// provides a default welcome flow if no user flow provided
	const parsedFlow: Flow = flow ?? welcomeFlow;

	// load options on start
	useEffect(() => {
		loadSettings()
	}, []);

	/**
	 * Loads bot settings.
	 */
	const loadSettings = async () => {
		const combinedSettings = await parseSettings(settings, themes);
		setBotSettings(combinedSettings);
		setSettingsLoaded(true);
	}

	/**
	 * Wraps bot options provider around child element.
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

		return result;
	}

	/**
	 * Checks if chatbot should be shown depending on platform.
	 */
	const shouldShowChatBot = () => {
		return settingsLoaded && (isDesktop && botSettings.general?.desktopEnabled)
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