import { useState, useEffect } from "react";

import { isDesktop } from "../../services/Utils";
import { useBotOptions } from "../../context/BotOptionsContext";

import "./ChatBotTooltip.css";

/**
 * Shows tooltip beside the chat bot button to user.
 */
const ChatBotTooltip = () => {

	// handles options for bot
	const { botOptions, setBotOptions } = useBotOptions();

	// tracks whether to show tooltip
	const [showTooltip, setShowTooltip] = useState<boolean>(false);

	// tracks if tooltip was shown on start
	const [shownTooltipOnStart, setShownTooltipOnStart] = useState<boolean>(false);

	// tooltip offset
	const [tooltipOffset, setTooltipOffset] = useState<number>(0);

	// checks if tooltip should be shown
	useEffect(() => {
		const mode = botOptions.tooltip?.mode;
		if (mode === "ALWAYS") {
			if (isDesktop) {
				let offset;
				if (botOptions.isOpen) {
					offset = (botOptions.chatWindowStyle?.width as number || 375) -
					(botOptions.chatButtonStyle?.width as number || 75)
				} else {
					offset = 0;
				}
				setTooltipOffset(offset);
				setShowTooltip(true);
			} else {
				if (botOptions.isOpen) {
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
			setShowTooltip(!botOptions.isOpen);
		}

	}, [botOptions.isOpen]);

	// styles for tooltip
	const tooltipStyle: React.CSSProperties = {
		transform: `translateX(-${tooltipOffset}px)`,
		right: (botOptions.chatButtonStyle?.width as number || 75) + 40,
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
					className={`rcb-chat-tooltip ${showTooltip ? "rcb-tooltip-show" : "rcb-tooltip-hide"}`}
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