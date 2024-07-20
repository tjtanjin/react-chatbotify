import { Dispatch, MouseEvent, SetStateAction } from "react";

import { useBotOptions } from "../../../context/BotOptionsContext";

import "./NotificationButton.css";

/**
 * Handles toggling of the audio feature.
 * 
 * @param notificationToggledOn boolean indicating whether notification is turned on
 * @param setNotificationToggledOn sets the state of the notification feature
 */
const NotificationButton = ({
	notificationToggledOn,
	setNotificationToggledOn
}: {
	notificationToggledOn: boolean;
	setNotificationToggledOn: Dispatch<SetStateAction<boolean>>;
}) => {
	// handles options for bot
	const { botOptions } = useBotOptions();

	return (
		<div
			style={{backgroundImage: `url(${botOptions.notification?.icon})`}}
			onMouseDown={(event: MouseEvent) => {
				event.preventDefault();
				setNotificationToggledOn(prev => !prev);
			}}
			className={`rcb-notification-icon-${
				notificationToggledOn ? "on" : "off"
			}`}
		></div>
	);
};

export default NotificationButton;
