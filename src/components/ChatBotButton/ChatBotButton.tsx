import { useSettings } from "../../context/SettingsContext";

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
	const { settings, setSettings } = useSettings();

	/**
	 * Toggles the chat window.
	 */
	const toggleChatWindow = () => {
		setSettings({...settings, isOpen: !settings.isOpen});
	};

	// styles for chat button
	const chatButtonStyle: React.CSSProperties = {
		backgroundImage: `url(${settings.chatButton?.icon}),
			linear-gradient(to right, ${settings.theme?.secondaryColor}, ${settings.theme?.primaryColor})`,
		width: 75,
		height: 75,
		...settings.chatButtonStyle
	};
	
	return (
		<>
			{!settings.theme?.embedded &&
				<button
					aria-label="Open Chat"
					style={chatButtonStyle}
					className={`rcb-toggle-button ${settings.isOpen ? "rcb-button-hide" : "rcb-button-show"}`}
					onClick={toggleChatWindow}
				>
					{!settings.notification?.disabled && settings.notification?.showCount &&
						<span style={settings.notificationBadgeStyle} className="rcb-badge">
							{unreadCount}
						</span>
					}
				</button>
			}
		</>
	);
};

export default ChatBotButton;