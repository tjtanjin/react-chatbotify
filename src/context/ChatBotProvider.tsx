import { createContext, useContext, useEffect, useState } from "react";

import { isDesktop } from "../utils/displayChecker";
import { parseConfig } from "../utils/configParser";
import { BotRefsProvider } from "./BotRefsContext";
import { BotStatesProvider } from "./BotStatesContext";
import { MessagesProvider } from "./MessagesContext";
import { PathsProvider } from "./PathsContext";
import { SettingsProvider } from "./SettingsContext";
import { StylesProvider } from "./StylesContext";
import { ToastsProvider } from "./ToastsContext";
import { Flow } from "../types/Flow";
import { Settings } from "../types/Settings";
import { Styles } from "../types/Styles";
import { Theme } from "../types/Theme";
import { DefaultSettings } from "../constants/internal/DefaultSettings";
import { DefaultStyles } from "../constants/internal/DefaultStyles";
import { WelcomeFlow } from "../constants/internal/WelcomeFlow";

// Create a context to detect whether ChatBotProvider is present
const ChatBotContext = createContext<boolean | undefined>(undefined);

export const useChatBotContext = () => {
	return useContext(ChatBotContext);
};

const ChatBotProvider = ({
	children,
	id = crypto.randomUUID(),
	flow = WelcomeFlow,
	settings,
	styles,
	themes,
}: {
	children: JSX.Element;
	id?: string;
	flow?: Flow,
	settings?: Settings;
	styles?: Styles;
	themes?: undefined | Theme | Array<Theme>;
}) => {
	// handles case where settings is empty
	if (settings == null || Object.keys(settings).length === 0) {
		settings = DefaultSettings;
	}

	// handles case where styles is empty
	if (styles == null || Object.keys(styles).length === 0) {
		styles = DefaultStyles;
	}

	// handles loading of chatbot only when options is loaded
	const [configLoaded, setConfigLoaded] = useState<boolean>(false);

	// handles setting of settings for the chat bot
	const [botSettings, setBotSettings] = useState<Settings>({});

	// handles setting of styles for the chat bot
	const [botStyles, setBotStyles] = useState<Styles>({});

	// load options on start
	useEffect(() => {
		loadConfig();
	}, [themes]);

	/**
	 * Loads settings for the chatbot.
	 */
	const loadConfig = async () => {
		const combinedConfig = await parseConfig(settings, styles, themes);

		setBotSettings(combinedConfig.settings);
		setBotStyles(combinedConfig.styles);
		setConfigLoaded(true);
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
					<ChatBotContext.Provider value={true}>
						<SettingsProvider initialSettings={botSettings}>
							<StylesProvider initialStyles={botStyles}>
								<ToastsProvider>
									<BotRefsProvider id={id} initialFlow={flow}>
										<PathsProvider>
											<BotStatesProvider settings={botSettings}>
												<MessagesProvider>
													{children}
												</MessagesProvider>
											</BotStatesProvider>
										</PathsProvider>
									</BotRefsProvider>
								</ToastsProvider>
							</StylesProvider>
						</SettingsProvider>
					</ChatBotContext.Provider>
				</div>
			}
		</>
	);
};

export default ChatBotProvider;
