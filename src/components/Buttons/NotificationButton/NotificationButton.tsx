import { MouseEvent } from "react";

import { useNotification } from "../../../hooks/useNotifications";
import { useSettingsContext } from "../../../context/SettingsContext";
import { useStylesContext } from "../../../context/StylesContext";

import "./NotificationButton.css";

/**
 * Handles toggling of the audio feature.
 */
const NotificationButton = () => {
	// handles settings
	const { settings } = useSettingsContext();

	// handles styles
	const { styles } = useStylesContext();

	// handles notifications
	const { notificationsToggledOn, toggleNotifications } = useNotification();

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
				toggleNotifications();
			}}
			style={notificationsToggledOn ? styles.notificationButtonStyle : styles.notificationButtonDisabledStyle}
		>
			<span
				className={`rcb-notification-icon-${
					notificationsToggledOn ? "on" : "off"
				}`}
				style={notificationsToggledOn? notificationIconStyle : notificationIconDisabledStyle}
			/>
		</div>
	);
};

export default NotificationButton;
