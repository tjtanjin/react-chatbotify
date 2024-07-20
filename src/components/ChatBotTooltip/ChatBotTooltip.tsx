import { useState, useEffect } from "react";

import { isDesktop } from "../../utils/displayChecker";
import { useBotSettings } from "../../context/BotSettingsContext";

import "./ChatBotTooltip.css";

/**
 * Shows tooltip beside the chat bot button to user.
 */
const ChatBotTooltip = () => {

	// handles options for bot
	const { botSettings, setBotSettings } = useBotSettings();

	// tracks whether to show tooltip
	const [showTooltip, setShowTooltip] = useState<boolean>(false);

	// tracks if tooltip was shown on start
	const [shownTooltipOnStart, setShownTooltipOnStart] = useState<boolean>(false);

	// tooltip offset
	const [tooltipOffset, setTooltipOffset] = useState<number>(0);

	// checks if tooltip should be shown
	useEffect(() => {
		const mode = botSettings.tooltip?.mode;
		if (mode === "ALWAYS") {
			if (isDesktop) {
				let offset;
				if (botSettings.isOpen) {
					offset = (botSettings.chatWindowStyle?.width as number || 375) -
					(botSettings.chatButtonStyle?.width as number || 75)
				} else {
					offset = 0;
				}
				setTooltipOffset(offset);
				setShowTooltip(true);
			} else {
				if (botSettings.isOpen) {
					setShowTooltip(false);
				} else {
					setShowTooltip(true);
				}
			}
		} else if (mode === "NEVER") {
			setShowTooltip(false);
		} else if (mode === "START") {
			if (!shownTooltipOnStart) {
				setShownTooltipOnStart(true);
				setShowTooltip(true);
			} else {
				setShowTooltip(false);
			}
		} else if (mode === "CLOSE") {
			setShowTooltip(!botSettings.isOpen);
		}

	}, [botSettings.isOpen]);

	// styles for tooltip
	const tooltipStyle: React.CSSProperties = {
		transform: `translateX(-${tooltipOffset}px)`,
		right: (botSettings.chatButtonStyle?.width as number || 75) + 40,
		bottom: 30,
		backgroundColor: botSettings.general?.secondaryColor,
		color: botSettings.general?.secondaryColor,
		...botSettings.tooltipStyle
	};

	// styles for tooltip tail
	const tooltipTailStyle: React.CSSProperties = {
		borderColor: `transparent transparent transparent ${tooltipStyle.backgroundColor}`
	};
	
	return (
		<>
			{!botSettings.general?.embedded &&
				<div 
					style={tooltipStyle}
					className={`rcb-chat-tooltip ${showTooltip ? "rcb-tooltip-show" : "rcb-tooltip-hide"}`}
					onClick={() => setBotSettings({...botSettings, isOpen: true})}
				>
					<span style={{ color: "#fff" }}>{botSettings.tooltip?.text}</span>
					<span className="rcb-chat-tooltip-tail" style={tooltipTailStyle}></span>
				</div>
			}
		</>
	);
};

export default ChatBotTooltip;