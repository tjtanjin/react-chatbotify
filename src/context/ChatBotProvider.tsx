import { createContext, useContext, useEffect, useRef, useState } from "react";

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


type ChatBotProviderContextType = {
	loadConfig: (id: string, flow: Flow, settings: Settings, styles: Styles,
		themes: Theme | Theme[] | undefined) => Promise<void>;
};
// Create a context to detect whether ChatBotProvider is present
const ChatBotContext = createContext<ChatBotProviderContextType | undefined>(undefined);
export const useChatBotContext = () => {
	return useContext(ChatBotContext);
};

const ChatBotProvider = ({
	children
}: {
	children: JSX.Element;
}) => {
	// handles bot id ref
	const botIdRef = useRef<string>("");

	// handles flow ref
	const botFlowRef = useRef<Flow>({});

	// handles settings for the chat bot
	const [botSettings, setBotSettings] = useState<Settings>({});

	// handles styles for the chat bot
	const [botStyles, setBotStyles] = useState<Styles>({});

	// handle DOM loaded event to ensure chatbot is loaded after DOM is ready (SSR support)
	const [isDomLoaded, setIsDomLoaded] = useState<boolean>(false);

	useEffect(() => {
		setIsDomLoaded(true);
	}, []);

	/**
	 * Loads configurations for the chatbot.
	 */
	const loadConfig = async (id: string, flow: Flow, settings: Settings,
		styles: Styles, themes: Theme | Theme[] | undefined) => {

		botIdRef.current = id;
		botFlowRef.current = flow;
		const combinedConfig = await parseConfig(settings, styles, themes);
		setBotSettings(combinedConfig.settings);
		setBotStyles(combinedConfig.styles);
	}

	if (!isDomLoaded) {
		return null;
	}	

	return (
		<div style={{fontFamily: botSettings.general?.fontFamily}}>
			<ChatBotContext.Provider value={{loadConfig}}>
				<SettingsProvider settings={botSettings} setSettings={setBotSettings}>
					<StylesProvider styles={botStyles} setStyles={setBotStyles}>
						<ToastsProvider>
							<BotRefsProvider botIdRef={botIdRef} flowRef={botFlowRef}>
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
	);
};

export default ChatBotProvider;
