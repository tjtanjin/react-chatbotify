import { MouseEvent } from "react";

import { useSettings } from "../../../context/SettingsContext";
import { useStyles } from "../../../context/StylesContext";

import "./CloseChatButton.css";

/**
 * Handles closing of chat.
 */
const CloseChatButton = () => {
	// handles options for bot
	const { settings, setSettings } = useSettings();

	// handles styles for bot
	const { styles } = useStyles();

	// styles for close chat icon
	const closeChatIconStyle: React.CSSProperties = {
		backgroundImage: `url(${settings.header?.closeChatIcon})`,
		...styles.closeChatIconStyle
	};

	return (
		<div
			onMouseDown={(event: MouseEvent) => {
				event.stopPropagation();
				setSettings({...settings, isOpen: false});
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
