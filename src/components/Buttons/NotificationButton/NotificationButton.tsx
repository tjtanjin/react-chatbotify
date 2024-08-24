import { Dispatch, MouseEvent, SetStateAction } from "react";

import { useSettings } from "../../../context/SettingsContext";
import { useStyles } from "../../../context/StylesContext";

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
	const { settings } = useSettings();

	// handles styles for bot
	const { styles } = useStyles();

	// styles for notification icon
	const notificationIconStyle: React.CSSProperties = {
		backgroundImage: `url(${settings.notification?.icon})`,
		...styles.notificationIconStyle
	};

	// styles for notification disabled icon
	const notificationIconDisabledStyle: React.CSSProperties = {
		backgroundImage: `url(${settings.notification?.icon})`,
		...styles.notificationIconDisabledStyle
	};

	return (
		<div
			onMouseDown={(event: MouseEvent) => {
				event.preventDefault();
				setNotificationToggledOn(prev => !prev);
			}}
			style={notificationToggledOn ? styles.notificationButtonStyle : styles.notificationButtonDisabledStyle}
		>
			<span
				className={`rcb-notification-icon-${
					notificationToggledOn ? "on" : "off"
				}`}
				style={notificationToggledOn? notificationIconStyle : notificationIconDisabledStyle}
			/>
		</div>
	);
};

export default NotificationButton;
