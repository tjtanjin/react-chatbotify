import { useBotSettings } from "../../context/BotSettingsContext";
import { useBotStyles } from "../../context/BotStylesContext";

import "./ChatBotButton.css";

/**
 * Toggles opening and closing of the chat window when theme.embedded is false.
 * 
 * @param unreadCount number of unread messages from the bot
 */
const ChatBotButton = ({
	unreadCount
}: {
	unreadCount: number;
}) => {

	// handles settings for bot
	const { botSettings, setBotSettings } = useBotSettings();

	// handles styles for bot
	const { botStyles } = useBotStyles();

	/**
	 * Toggles the chat window.
	 */
	const toggleChatWindow = () => {
		setBotSettings({...botSettings, isOpen: !botSettings.isOpen});
	};

	// styles for chat button
	const chatButtonStyle: React.CSSProperties = {
		backgroundImage: `url(${botSettings.chatButton?.icon}),
			linear-gradient(to right, ${botSettings.general?.secondaryColor}, ${botSettings.general?.primaryColor})`,
		width: 75,
		height: 75,
		...botStyles.chatButtonStyle
	};
	
	return (
		<>
			{!botSettings.general?.embedded &&
				<button
					aria-label="Open Chat"
					style={chatButtonStyle}
					className={`rcb-toggle-button ${botSettings.isOpen ? "rcb-button-hide" : "rcb-button-show"}`}
					onClick={toggleChatWindow}
				>
					{!botSettings.notification?.disabled && botSettings.notification?.showCount &&
						<span style={botStyles.notificationBadgeStyle} className="rcb-badge">
							{unreadCount}
						</span>
					}
				</button>
			}
		</>
	);
};

export default ChatBotButton;