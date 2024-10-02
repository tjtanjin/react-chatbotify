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
		...styles.closeChatIconStyle
	};

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
			<span
				className="rcb-close-chat-icon"
				style={closeChatIconStyle}
			/>
		</div>
	);
};

export default CloseChatButton;
