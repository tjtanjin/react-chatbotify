import { useEffect, useRef, useState } from "react";
import { Root } from "react-dom/client";

import ChatBotContainer from "./ChatBotContainer";
import ChatBotLoader from "./ChatBotLoader";
import { generateSecureUUID } from "../utils/idGenerator";
import ChatBotProvider, { useChatBotContext } from "../context/ChatBotProvider";
import { Settings } from "../types/Settings";
import { Styles } from "../types/Styles";
import { Flow } from "../types/Flow";
import { Theme } from "../types/Theme";
import { Plugin } from "../types/Plugin";
import { DefaultSettings } from "../constants/internal/DefaultSettings";
import { DefaultStyles } from "../constants/internal/DefaultStyles";
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
	id = generateSecureUUID(),
	flow = WelcomeFlow,
	settings = DefaultSettings,
	styles = DefaultStyles,
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
	// handles case where flow is empty
	if (Object.keys(flow).length === 0) {
		flow = WelcomeFlow;
	}

	// handles case where settings is empty
	if (Object.keys(settings).length === 0) {
		settings = DefaultSettings;
	}

	// handles case where styles is empty
	if (Object.keys(styles).length === 0) {
		styles = DefaultStyles;
	}

	// handles loading of chatbot only when config is loaded
	const [configLoaded, setConfigLoaded] = useState<boolean>(false);
	
	// used to determine if users provided their own chatbotprovider
	const chatBotContext = useChatBotContext();

	// handles shadow container ref
	const shadowContainerRef = useRef<HTMLDivElement | null>(null);

	// handles react root ref (to avoid recreating it)
	const reactRootRef = useRef<Root | null>(null);

	// handles rendering of chatbot inside shadow dom
	useEffect(() => {
		if (!shadowContainerRef.current) {
			return;
		}

		// checks if shadow root exists, otherwise attach to it
		if (!shadowContainerRef.current.shadowRoot) {
			shadowContainerRef.current.attachShadow({ mode: "open" });
		}

		// if no shadow root, return
		const shadowRoot = shadowContainerRef.current.shadowRoot;
		if (!shadowRoot) {
			return;
		}

		import("react-dom/client")
			.then(({ createRoot }) => {
				// handles react >=18
				if (!reactRootRef.current) {
					reactRootRef.current = createRoot(shadowRoot);
				}
				reactRootRef.current.render(renderChatBot());
			})
			.catch(() => {
				// handles react <18
				import("react-dom").then(({ render }) => {
					render(renderChatBot(), shadowRoot);
				});
			});
	}, [configLoaded]);

	/**
	 * Renders chatbot with provider depending on whether one was provided by the user.
	 */
	const renderChatBot = () => {
		if (chatBotContext) {
			return (
				<>
					<ChatBotLoader shadowContainerRef={shadowContainerRef} id={id} flow={flow} settings={settings}
						styles={styles} themes={themes} setConfigLoaded={setConfigLoaded}
					/>
					{configLoaded && <ChatBotContainer plugins={plugins} />}
				</>
			);
		}
		return (
			<ChatBotProvider>
				<ChatBotLoader shadowContainerRef={shadowContainerRef} id={id} flow={flow} settings={settings}
					styles={styles} themes={themes} setConfigLoaded={setConfigLoaded}
				/>
				{configLoaded && <ChatBotContainer plugins={plugins} />}
			</ChatBotProvider>
		)
	}

	return (
		chatBotContext !== null ? ( 
			<div ref={shadowContainerRef} id={`shadow-container-${id}`}></div>
		) : (
			<ChatBotProvider>
				<div ref={shadowContainerRef} id={`shadow-container-${id}`}></div>
			</ChatBotProvider>
		)
	)
};

export default ChatBot;
