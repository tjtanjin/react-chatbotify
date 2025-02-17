import { MouseEvent } from "react";
import { useSettingsContext } from "../../../context/SettingsContext";
import { useStylesContext } from "../../../context/StylesContext";

import "./BotTypingIndicator.css";

/**
 * Renders the bot typing indicator.
 */
const BotTypingIndicator = () => {
	// handles settings
	const { settings } = useSettingsContext();

	// handles styles
	const { styles } = useStylesContext();

	const botBubbleEntryStyle = settings.botBubble?.animate ? "rcb-bot-message-entry" : "";

	return (
		<div className="rcb-bot-message-container">
			{settings.botBubble?.showAvatar && (
				<div
					style={{ backgroundImage: `url("${settings.botBubble?.avatar}")` }}
					className="rcb-message-bot-avatar"
				/>
			)}
			<div
				onMouseDown={(event: MouseEvent) => {
					event.preventDefault();
				}}
				className={`rcb-bot-message ${botBubbleEntryStyle}`}
			>
				<div className="rcb-typing-indicator" style={{ ...styles?.rcbTypingIndicatorContainerStyle }}>
					<span className="rcb-dot" style={{ ...styles?.rcbTypingIndicatorDotStyle }}/>
					<span className="rcb-dot" style={{ ...styles?.rcbTypingIndicatorDotStyle }}/>
					<span className="rcb-dot" style={{ ...styles?.rcbTypingIndicatorDotStyle }}/>
				</div>
			</div>
		</div>
	);
};

export default BotTypingIndicator;
