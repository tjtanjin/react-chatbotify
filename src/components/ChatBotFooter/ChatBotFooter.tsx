
import { Fragment } from "react";

import { useSettings } from "../../context/SettingsContext";
import { useBotStyles } from "../../context/BotStylesContext";

import "./ChatBotFooter.css";

/**
 * Contains footer buttons and text.
 * 
 * @param buttons list of buttons to render in the footer
 */
const ChatBotFooter = ({
	buttons
}: {
	buttons: JSX.Element[];
}) => {
	// handles settings for bot
	const { settings } = useSettings();

	// handles styles for bot
	const { botStyles } = useBotStyles();

	return (
		<div style={botStyles.footerStyle} className="rcb-chat-footer-container">
			<div className="rcb-chat-footer">
				{buttons?.map((button: JSX.Element, index: number) => 
					<Fragment key={index}>{button}</Fragment>
				)}
			</div>
			<span>{settings.footer?.text}</span>
		</div>
	);
};

export default ChatBotFooter;
