import React, { Fragment  } from "react";

import { useBotSettings } from "../../context/BotSettingsContext";
import { useBotStyles } from "../../context/BotStylesContext";

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
	// handles settings for bot
	const { botSettings } = useBotSettings();

	// handles styles for bot
	const { botStyles } = useBotStyles();

	// styles for header
	const headerStyle: React.CSSProperties = {
		background: `linear-gradient(to right, ${botSettings.general?.secondaryColor },
			${botSettings.general?.primaryColor})`,
		...botStyles.headerStyle
	}

	return (
		<div style={headerStyle} className="rcb-chat-header-container">
			<div className="rcb-chat-header">
				{botSettings.header?.showAvatar &&
					<div 
						style={{backgroundImage: `url(${botSettings.header?.avatar})`}} 
						className="rcb-bot-avatar"
					/>
				}
				{botSettings.header?.title}
			</div>
			<div className="rcb-chat-header">
				{buttons?.map((button: JSX.Element, index: number) => 
					<Fragment key={index}>{button}</Fragment>
				)}
			</div>
		</div>
	);
};

export default ChatBotHeader;