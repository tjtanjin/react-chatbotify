import { MouseEvent } from "react";

import { useNotifications } from "../../../hooks/useNotifications";
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
	const { notificationsToggledOn, toggleNotifications } = useNotifications();

	// styles for notification icon
	const notificationIconStyle: React.CSSProperties = {
		backgroundImage: `url(${settings.notification?.icon})`,
		fill: "#e8eaed",
		...styles.notificationIconStyle
	};

	// styles for notification disabled icon
	const notificationIconDisabledStyle: React.CSSProperties = {
		backgroundImage: `url(${settings.notification?.icon})`,
		fill: "#e8eaed",
		...styles.notificationIconStyle, // by default inherit the base style
		...styles.notificationIconDisabledStyle
	};

	/**
	 * Renders button depending on whether an svg component or image url is provided.
	 */
	const renderButton = () => {
		const IconComponent = notificationsToggledOn
			? settings.notification?.icon
			: settings.notification?.iconDisabled;
		if (typeof IconComponent === "string") {
			return (
				<span
					className={`rcb-notification-icon-${notificationsToggledOn ? "on" : "off"}`}
					style={notificationsToggledOn? notificationIconStyle : notificationIconDisabledStyle}
				/>
			)
		}
		return (
			IconComponent &&
			<span className={`rcb-notification-icon-${notificationsToggledOn ? "on" : "off"}`}>
				<IconComponent style={notificationsToggledOn? notificationIconStyle : notificationIconDisabledStyle}/>
			</span>
		)
	}

	return (
		<div
			aria-label={settings.ariaLabel?.notificationButton ?? "toggle notifications"}
			role="button" 
			onMouseDown={(event: MouseEvent) => {
				event.preventDefault();
				toggleNotifications();
			}}
			style={notificationsToggledOn
				? styles.notificationButtonStyle
				: {...styles.notificationButtonStyle, ...styles.notificationButtonDisabledStyle}
			}
		>
			{renderButton()}
		</div>
	);
};

export default NotificationButton;
