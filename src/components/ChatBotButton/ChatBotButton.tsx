import { useChatWindowInternal } from "../../hooks/internal/useChatWindowInternal";
import { useBotStatesContext } from "../../context/BotStatesContext";
import { useSettingsContext } from "../../context/SettingsContext";
import { useStylesContext } from "../../context/StylesContext";

import "./ChatBotButton.css";

/**
 * Toggles opening and closing of the chat window when general.embedded is false.
 */
const ChatBotButton = () => {
	// handles settings
	const { settings } = useSettingsContext();

	// handles styles
	const { styles } = useStylesContext();

	// handles bot states
	const { unreadCount } = useBotStatesContext();

	// handles chat window
	const { isChatWindowOpen, toggleChatWindow } = useChatWindowInternal();

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
				<div
					aria-label={settings.ariaLabel?.chatButton ?? "open chat"}
					role="button"
					style={chatButtonStyle}
					className={`rcb-toggle-button ${isChatWindowOpen ? "rcb-button-hide" : "rcb-button-show"}`}
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
				</div>
			}
		</>
	);
};

export default ChatBotButton;
