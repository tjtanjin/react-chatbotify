import { useEffect, useState } from "react";

import ChatBotContainer from "./ChatBotContainer";
import { parseSettings } from "../utils/SettingsParser";
import { isDesktop } from "../utils/displayChecker";
import { SettingsContext } from "../context/SettingsContext";
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
 * @param options options to setup the bot
 * @param themes themes to apply to the bot
 */
const ChatBot = ({
	flow,
	options,
	themes,
}: {
	flow?: Flow,
	options?: Settings
	themes?: undefined | Theme | Array<Theme>,
}) => {

	// handles loading of chatbot only when options is loaded
	const [optionsLoaded, setOptionsLoaded] = useState<boolean>(false);

	// handles setting of options for the chat bot
	const [settings, setSettings] = useState<Settings>({});

	// handles messages between user and the chat bot
	const [messages, setMessages] = useState<Message[]>([]);

	// handles paths of the user
	const [paths, setPaths] = useState<string[]>([]);

	// provides a default welcome flow if no user flow provided
	const parsedFlow: Flow = flow ?? welcomeFlow;

	// load options on start
	useEffect(() => {
		loadOptions()
	}, []);

	/**
	 * Loads bot options.
	 */
	const loadOptions = async () => {
		const combinedOptions = await parseSettings(options, themes);
		setSettings(combinedOptions);
		setOptionsLoaded(true);
	}

	/**
	 * Wraps bot options provider around child element.
	 * 
	 * @param children child element to wrap around
	 */
	const wrapSettingsProvider = (children: JSX.Element) => {
		return (
			<SettingsContext.Provider value={{settings, setSettings}}>
				{children}
			</SettingsContext.Provider>
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
		if (!settings.advance?.useCustomMessages) {
			result = wrapMessagesProvider(result);
		}

		if (!settings.advance?.useCustomPaths) {
			result = wrapPathsProvider(result);
		}

		if (!settings.advance?.useCustomSettings) {
			result = wrapSettingsProvider(result);
		}

		return result;
	}

	/**
	 * Checks if chatbot should be shown depending on platform.
	 */
	const shouldShowChatBot = () => {
		return optionsLoaded && (isDesktop && settings.theme?.desktopEnabled)
			|| (!isDesktop && settings.theme?.mobileEnabled);
	}

	return (
		<>
			{shouldShowChatBot() &&
				<div style={{fontFamily: settings.theme?.fontFamily}}>
					{renderChatBot()}
				</div>
			}
		</>
	);
};

export default ChatBot;