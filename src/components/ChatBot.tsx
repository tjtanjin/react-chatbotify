import ChatBotContainer from "./ChatBotContainer";
import ChatBotProvider, { useChatBotContext } from "../context/ChatBotProvider";
import { Settings } from "../types/Settings";
import { Styles } from "../types/Styles";
import { Flow } from "../types/Flow";
import { Theme } from "../types/Theme";

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
	themes,
	plugins
}: {
	id?: string;
	flow?: Flow;
	settings?: Settings;
	styles?: Styles;
	themes?: undefined | Theme | Array<Theme>;
	plugins?: Array<(...args: unknown[]) => unknown>;
}) => {

	// checks if the ChatBot is inside a provider
	const isInsideProvider = useChatBotContext();

	/**
	 * Renders chatbot with provider depending on whether one was provided by the user.
	 */
	const renderChatBot = () => {
		if (isInsideProvider) {
			return (<ChatBotContainer plugins={plugins} />);
		}
		return (
			<ChatBotProvider id={id} flow={flow} settings={settings} styles={styles} themes={themes}>
				<ChatBotContainer plugins={plugins} />
			</ChatBotProvider>
		)
	}

	return renderChatBot();
};

export default ChatBot;
