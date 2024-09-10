import React, { Fragment } from "react";

import { useSettingsContext } from "../../context/SettingsContext";
import { useStylesContext } from "../../context/StylesContext";

import "./ChatBotHeader.css";

/**
 * Contains header buttons and avatar.
 * 
 * @param buttons list of buttons to render in the header
 */
const ChatBotHeader = ({ buttons }: { buttons: JSX.Element[] }) => {
	// handles settings
	const { settings } = useSettingsContext();

	// handles styles
	const { styles } = useStylesContext();

	// styles for header
	const headerStyle: React.CSSProperties = {
		backgroundImage: `linear-gradient(to right, ${settings.general?.secondaryColor},
			${settings.general?.primaryColor})`,
		...styles.headerStyle
	}

	return (
		<div style={headerStyle} className="rcb-chat-header-container">
			<div className="rcb-chat-header">
				{settings.header?.showAvatar &&
					<div 
						style={{backgroundImage: `url(${settings.header?.avatar})`}} 
						className="rcb-bot-avatar"
					/>
				}
				{settings.header?.title}
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
