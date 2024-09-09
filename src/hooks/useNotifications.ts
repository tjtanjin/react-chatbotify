import { useNotificationInternal } from "./internal/useNotificationsInternal";

/**
 * External custom hook for managing notifications.
 */
export const useNotification = () => {
	// handles notifications
	const {notificationsToggledOn, toggleNotifications, playNotificationSound } = useNotificationInternal();

	return {
		notificationsToggledOn,
		toggleNotifications,
		playNotificationSound,
	};
};
