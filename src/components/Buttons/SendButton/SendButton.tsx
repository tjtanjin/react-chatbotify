import { useState, MouseEvent } from "react";

import { useSettings } from "../../../context/SettingsContext";
import { useBotStyles } from "../../../context/BotStylesContext";

import "./SendButton.css";

/**
 * Sends current user input to the chat bot.
 * 
 * @param handleSubmit handles submission of user input
 */
const SendButton = ({
	handleSubmit
}: {
	handleSubmit: () => void;
}) => {

	// handles settings for bot
	const { settings } = useSettings();

	// handles styles for bot
	const { botStyles } = useBotStyles();

	// tracks if send button is hovered
	const [isHovered, setIsHovered] = useState<boolean>(false);

	// styles for send button
	const sendButtonStyle: React.CSSProperties = {
		backgroundColor: settings.general?.primaryColor,
		...botStyles.sendButtonStyle
	};

	// styles for hovered send button
	const sendButtonHoveredStyle: React.CSSProperties = {
		backgroundColor: settings.general?.secondaryColor,
		...botStyles.sendButtonHoveredStyle
	};
	
	// styles for send icon
	const sendIconStyle: React.CSSProperties = {
		backgroundImage: `url(${settings.chatInput?.sendButtonIcon})`,
	};

	/**
	 * Handles mouse enter event on send button.
	 */
	const handleMouseEnter = () => {
		setIsHovered(true);
	};
  
	/**
	 * Handles mouse leave event on send button.
	 */
	const handleMouseLeave = () => {
		setIsHovered(false);
	};
	
	return (
		<div
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
			style={isHovered ? sendButtonHoveredStyle : sendButtonStyle}
			onMouseDown={(event: MouseEvent) => {
				event?.preventDefault();
				handleSubmit();
			}}
			className="rcb-send-button"
		>
			<span className="rcb-send-icon" style={sendIconStyle} />
		</div>
	);
};

export default SendButton;