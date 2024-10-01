import { useState, MouseEvent } from "react";

import { useSubmitInputInternal } from "../../../hooks/internal/useSubmitInputInternal";
import { useBotStatesContext } from "../../../context/BotStatesContext";
import { useSettingsContext } from "../../../context/SettingsContext";
import { useStylesContext } from "../../../context/StylesContext";

import "./SendButton.css";

/**
 * Sends current user input to the chat bot.
 */
const SendButton = () => {
	// handles settings
	const { settings } = useSettingsContext();

	// handles styles
	const { styles } = useStylesContext();

	// handles bot states
	const { textAreaDisabled } = useBotStatesContext();

	// tracks if send button is hovered
	const [isHovered, setIsHovered] = useState<boolean>(false);

	// handles user input submission
	const { handleSubmitText } = useSubmitInputInternal();

	// styles for send button
	const sendButtonStyle: React.CSSProperties = {
		backgroundColor: settings.general?.primaryColor,
		...styles.sendButtonStyle
	};

	// styles for disabled send button
	const sendButtonDisabledStyle: React.CSSProperties = {
		cursor: `url(${settings.general?.actionDisabledIcon}), auto`,
		backgroundColor: settings.general?.primaryColor,
		...styles.sendButtonDisabledStyle
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
				if (textAreaDisabled) {
					return;
				}
				await handleSubmitText();
			}}
			style={textAreaDisabled
				? sendButtonDisabledStyle
				: (isHovered ? sendButtonHoveredStyle : sendButtonStyle)}
			className="rcb-send-button"
		>
			<span className="rcb-send-icon" style={sendIconStyle} />
		</div>
	);
};

export default SendButton;
