
import { Fragment } from "react";

import { useBotOptions } from "../../context/BotOptionsContext";

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
	const { botOptions } = useBotOptions();

	return (
		<div style={botOptions.footerStyle} className="rcb-chat-footer-container">
			<div className="rcb-chat-footer">
				{buttons?.map((button: JSX.Element, index: number) => 
					<Fragment key={index}>{button}</Fragment>
				)}
			</div>
			<span>{botOptions.footer?.text}</span>
		</div>
	);
};

export default ChatBotFooter;
