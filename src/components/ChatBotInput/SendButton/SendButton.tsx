import { useState, MouseEvent } from "react";

import { useBotOptions } from "../../../context/BotOptionsContext";

import "./SendButton.css";

/**
 * Sends current user input to the chat bot.
 * 
 * @param handleSubmit handles submission of user input
 */
const SendButton = ({
	handleSubmit
}: {
	handleSubmit: (event: MouseEvent) => void;
}) => {

	// handles options for bot
	const { botOptions } = useBotOptions();

	// tracks if send button is hovered
	const [isHovered, setIsHovered] = useState<boolean>(false);

	// styles for send button
	const sendButtonStyle = {
		backgroundColor: botOptions.theme?.primaryColor,
		...botOptions.sendButtonStyle
	};

	// styles for hovered send button
	const sendButtonHoveredStyle = {
		backgroundColor: botOptions.theme?.secondaryColor,
		...botOptions.sendButtonHoveredStyle
	};
	
	// styles for send icon
	const sendIconStyle = {
		backgroundImage: `url(${botOptions.chatInput?.sendButtonIcon})`,
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
			onMouseDown={handleSubmit}
			className="rcb-send-button"
		>
			<span className="rcb-send-icon" style={sendIconStyle} />
		</div>
	);
};

export default SendButton;