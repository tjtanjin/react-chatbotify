import { MouseEvent } from "react";

import { useChatWindowInternal } from "../../../hooks/internal/useChatWindowInternal";
import { useSettingsContext } from "../../../context/SettingsContext";
import { useStylesContext } from "../../../context/StylesContext";

import "./CloseChatButton.css";

/**
 * Handles closing of chat.
 */
const CloseChatButton = () => {
	// handles settings
	const { settings } = useSettingsContext();

	// handles styles
	const { styles } = useStylesContext();

	// handles chat window
	const { openChat } = useChatWindowInternal();

	// styles for close chat icon
	const closeChatIconStyle: React.CSSProperties = {
		backgroundImage: `url(${settings.header?.closeChatIcon})`,
		fill: "#e8eaed",
		stroke: "#e8eaed",
		...styles.closeChatIconStyle
	};

	/**
	 * Renders button depending on whether an svg component or image url is provided.
	 */
	const renderButton = () => {
		const IconComponent = settings.header?.closeChatIcon;
		if (!IconComponent || typeof IconComponent === "string") {
			return (
				<span
					className="rcb-close-chat-icon"
					data-testid="rcb-close-chat-icon"
					style={closeChatIconStyle}
				/>
			)
		}
		return (
			IconComponent &&
			<span className="rcb-close-chat-icon" data-testid="rcb-close-chat-icon">
				<IconComponent style={closeChatIconStyle}/>
			</span>
		)
	}

	return (
		<div
			aria-label={settings.ariaLabel?.closeChatButton ?? "close chat"}
			role="button" 
			onMouseDown={(event: MouseEvent) => {
				event.stopPropagation();
				openChat(false);
			}}
			style={styles.closeChatButtonStyle}
		>
			{renderButton()}
		</div>
	);
};

export default CloseChatButton;
