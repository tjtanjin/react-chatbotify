import React, { Fragment  } from "react";

import { useBotOptions } from "../../context/BotOptionsContext";

import "./ChatBotHeader.css";

/**
 * Contains header buttons and avatar.
 * 
 * @param buttons list of buttons to render in the header
 */
const ChatBotHeader = ({
	buttons
}: {
	buttons: JSX.Element[]
}) => {
	// handles options for bot
	const { botOptions } = useBotOptions();

	// styles for header
	const headerStyle: React.CSSProperties = {
		background: `linear-gradient(to right, ${botOptions.theme?.secondaryColor },
			${botOptions.theme?.primaryColor})`,
		...botOptions.headerStyle
	}

	return (
		<div style={headerStyle} className="rcb-chat-header-container">
			<div className="rcb-chat-header">
				{botOptions.header?.showAvatar &&
					<div 
						style={{backgroundImage: `url(${botOptions.header?.avatar})`}} 
						className="rcb-bot-avatar"
					/>
				}
				{botOptions.header?.title}
			</div>
			<div className="rcb-chat-header">
				{buttons?.map((button: any, index: number) => 
					<Fragment key={index}>{button}</Fragment>
				)}
			</div>
		</div>
	);
};

export default ChatBotHeader;