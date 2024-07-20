
import { Fragment } from "react";

import { useBotSettings } from "../../context/BotSettingsContext";

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
	// handles options for bot
	const { botSettings } = useBotSettings();

	return (
		<div style={botSettings.footerStyle} className="rcb-chat-footer-container">
			<div className="rcb-chat-footer">
				{buttons?.map((button: JSX.Element, index: number) => 
					<Fragment key={index}>{button}</Fragment>
				)}
			</div>
			<span>{botSettings.footer?.text}</span>
		</div>
	);
};

export default ChatBotFooter;
