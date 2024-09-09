import ChatBotContainer from "./ChatBotContainer";
import ChatBotProvider, { useChatBotContext } from "../context/ChatBotProvider";
import { Settings } from "../types/Settings";
import { Styles } from "../types/Styles";
import { Flow } from "../types/Flow";
import { Theme } from "../types/Theme";
import { welcomeFlow } from "../constants/internal/WelcomeFlow";

/**
 * Determines if user gave a provider or if one needs to be created, before rendering the chatbot.
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
	settings?: Settings
	styles?: Styles,
	themes?: undefined | Theme | Array<Theme>,
}) => {
	// provides a default welcome flow if no user flow provided
	const parsedFlow: Flow = flow ?? welcomeFlow;

	// checks if the ChatBot is inside a provider
	const isInsideProvider = useChatBotContext();

	/**
	 * Renders chatbot with provider depending on whether one was provided by the user.
	 */
	const renderChatBot = () => {
		if (isInsideProvider) {
			return (<ChatBotContainer flow={parsedFlow} />);
		}
		return (
			<ChatBotProvider settings={settings} styles={styles} themes={themes}>
				<ChatBotContainer flow={parsedFlow} />
			</ChatBotProvider>
		)
	}

	return renderChatBot();
};

export default ChatBot;
