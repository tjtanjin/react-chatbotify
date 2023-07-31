import { useBotOptions } from "../../context/BotOptionsContext";

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

	// handles options for bot
	const { botOptions, setBotOptions } = useBotOptions();

	/**
	 * Toggles the chat window.
	 */
	const toggleChatWindow = () => {
		setBotOptions({...botOptions, isOpen: !botOptions.isOpen});
	};

	// styles for chat button
	const chatButtonStyle = {
		backgroundImage: `url(${botOptions.chatButton?.icon}),
			linear-gradient(to right, ${botOptions.theme?.secondaryColor}, ${botOptions.theme?.primaryColor})`,
		width: 75,
		height: 75,
		...botOptions.chatButtonStyle
	};
	
	return (
		<>
			{!botOptions.theme?.embedded &&
				<button
					style={chatButtonStyle}
					className={`rcb-toggle-button ${botOptions.isOpen ? "rcb-button-hide" : "rcb-button-show"}`}
					onClick={toggleChatWindow}
				>
					{!botOptions.notification?.disabled &&
						<span style={botOptions.notificationBadgeStyle} className="rcb-badge">
							{unreadCount}
						</span>
					}
				</button>
			}
		</>
	);
};

export default ChatBotButton;