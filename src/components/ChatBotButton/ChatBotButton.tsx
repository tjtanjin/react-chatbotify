import { useSettings } from "../../context/SettingsContext";
import { useStyles } from "../../context/StylesContext";

import "./ChatBotButton.css";

/**
 * Toggles opening and closing of the chat window when general.embedded is false.
 * 
 * @param unreadCount number of unread messages from the bot
 */
const ChatBotButton = ({
	unreadCount
}: {
	unreadCount: number;
}) => {

	// handles settings for bot
	const { settings, setSettings } = useSettings();

	// handles styles for bot
	const { styles } = useStyles();

	/**
	 * Toggles the chat window.
	 */
	const toggleChatWindow = () => {
		setSettings({...settings, isOpen: !settings.isOpen});
	};

	// styles for chat button
	const chatButtonStyle: React.CSSProperties = {
		backgroundImage: `linear-gradient(to right, ${settings.general?.secondaryColor},
			${settings.general?.primaryColor})`,
		...styles.chatButtonStyle
	};

	// styles for chat icon
	const chatIconStyle: React.CSSProperties = {
		backgroundImage: `url(${settings.chatButton?.icon})`,
		...styles.chatIconStyle
	};
	
	return (
		<>
			{!settings.general?.embedded &&
				<button
					aria-label="Open Chat"
					style={chatButtonStyle}
					className={`rcb-toggle-button ${settings.isOpen ? "rcb-button-hide" : "rcb-button-show"}`}
					onClick={toggleChatWindow}
				>
					<span
						className="rcb-toggle-icon"
						style={chatIconStyle}
					/>
					{!settings.notification?.disabled && settings.notification?.showCount &&
						<span style={styles.notificationBadgeStyle} className="rcb-badge">
							{unreadCount}
						</span>
					}
				</button>
			}
		</>
	);
};

export default ChatBotButton;