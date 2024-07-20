import { Dispatch, MouseEvent, SetStateAction } from "react";

import { useBotSettings } from "../../../context/BotSettingsContext";

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
	const { botSettings } = useBotSettings();

	return (
		<div
			style={{backgroundImage: `url(${botSettings.notification?.icon})`}}
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
