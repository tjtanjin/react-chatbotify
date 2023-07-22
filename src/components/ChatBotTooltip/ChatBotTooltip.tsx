import { useState, useEffect } from "react";

import { useBotOptions } from "../../context/BotOptionsContext";

import "./ChatBotTooltip.css";

/**
 * Shows tooltip beside the chat bot button to user.
 */
const ChatBotTooltip = () => {

	// handles options for bot
	const { botOptions, setBotOptions } = useBotOptions();

	// tracks whether to show tooltip
	const [showTooltip, setShowTooltip] = useState<boolean>(true);

	// checks if tooltip should be shown on load
	useEffect(() => {
		if (botOptions.tooltip?.mode === "ALWAYS") {
			return;
		}
		if (botOptions.isOpen) {
			setShowTooltip(false);
		}
	}, [botOptions.isOpen]);

	/**
	 * Checks if tooltip should be shown.
	 */
	const shouldShowTooltip = () => {
		const mode = botOptions.tooltip?.mode;
		if (mode === "ALWAYS") {
			return true;
		} else if (mode === "START") {
			return showTooltip;
		} else if (mode === "CLOSE") {
			return !botOptions.isOpen;
		} else {
			return false;
		}
	};

	// styles for tooltip
	const tooltipStyle = {
		display: shouldShowTooltip() ? "visible" : "hidden",
		opacity: shouldShowTooltip() ? 1 : 0,
		right: `calc(${botOptions.chatButtonStyle?.width || 75}px + 40px)`,
		bottom: 30,
		backgroundColor: botOptions.theme?.secondaryColor,
		color: botOptions.theme?.secondaryColor,
		...botOptions.tooltipStyle
	};

	// styles for tooltip tail
	const tooltipTailStyle = {
		borderColor: `transparent transparent transparent ${tooltipStyle.backgroundColor}`
	};
	
	return (
		<>
			{!botOptions.theme?.embedded &&
				<div 
					style={tooltipStyle}
					className={`rcb-chat-tooltip ${botOptions.isOpen ? "rcb-tooltip-hide" : "rcb-tooltip-show"}`}
					onClick={() => setBotOptions({...botOptions, isOpen: true})}
				>
					<span style={{ color: "#fff" }}>{botOptions.tooltip?.text}</span>
					<span className="rcb-chat-tooltip-tail" style={tooltipTailStyle}></span>
				</div>
			}
		</>
	);
};

export default ChatBotTooltip;