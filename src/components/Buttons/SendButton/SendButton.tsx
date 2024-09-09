import { useState, MouseEvent } from "react";

import { useSubmitInputInternal } from "../../../hooks/internal/useSubmitInputInternal";
import { useSettingsContext } from "../../../context/SettingsContext";
import { useStylesContext } from "../../../context/StylesContext";
import { Flow } from "../../../types/Flow";

import "./SendButton.css";

/**
 * Sends current user input to the chat bot.
 * 
 * @param flow conversation flow for the bot
 */
const SendButton = ({ flow }: { flow: Flow }) => {
	// handles settings
	const { settings } = useSettingsContext();

	// handles styles
	const { styles } = useStylesContext();

	// tracks if send button is hovered
	const [isHovered, setIsHovered] = useState<boolean>(false);

	// handles user input submission
	const { handleSubmitText } = useSubmitInputInternal(flow);

	// styles for send button
	const sendButtonStyle: React.CSSProperties = {
		backgroundColor: settings.general?.primaryColor,
		...styles.sendButtonStyle
	};

	// styles for hovered send button
	const sendButtonHoveredStyle: React.CSSProperties = {
		backgroundColor: settings.general?.secondaryColor,
		...styles.sendButtonHoveredStyle
	};
	
	// styles for send icon
	const sendIconStyle: React.CSSProperties = {
		backgroundImage: `url(${settings.chatInput?.sendButtonIcon})`,
		...styles.sendIconStyle
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
			onMouseDown={async (event: MouseEvent) => {
				event?.preventDefault();
				await handleSubmitText();
			}}
			style={isHovered ? sendButtonHoveredStyle : sendButtonStyle}
			className="rcb-send-button"
		>
			<span className="rcb-send-icon" style={sendIconStyle} />
		</div>
	);
};

export default SendButton;
