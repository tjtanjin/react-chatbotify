import { useCallback } from "react";

import { useDispatchRcbEventInternal } from "./useDispatchRcbEventInternal";
import { useBotStatesContext } from "../../context/BotStatesContext";
import { useBotRefsContext } from "../../context/BotRefsContext";
import { useSettingsContext } from "../../context/SettingsContext";
import { RcbEvent } from "../../constants/RcbEvent";

/**
 * Internal custom hook for managing notifications.
 */
export const useNotificationInternal = () => {
	// handles settings
	const { settings } = useSettingsContext();

	// handles bot states
	const {
		notificationsToggledOn,
		setSyncedNotificationsToggledOn,
		hasInteractedPage,
		unreadCount,
		setUnreadCount,
		syncedNotificationsToggledOnRef,
	} = useBotStatesContext();

	// handles bot refs
	const { audioBufferRef, audioContextRef, gainNodeRef } = useBotRefsContext();

	// handles rcb events
	const { dispatchRcbEvent } = useDispatchRcbEventInternal();

	/**
	 * Sets up the notifications feature (initial toggle status and sound).
	 */
	const setUpNotifications = useCallback(async () => {
		const notificationSound = settings.notification?.sound;
		audioContextRef.current = new AudioContext();
		const gainNode = audioContextRef.current.createGain();
		gainNode.gain.value = settings.notification?.volume ?? 0.2;
		gainNodeRef.current = gainNode;

		let audioSource;
		if (notificationSound?.startsWith("data:audio")) {
			const binaryString = atob(notificationSound.split(",")[1]);
			const arrayBuffer = new ArrayBuffer(binaryString.length);
			const uint8Array = new Uint8Array(arrayBuffer);
			for (let i = 0; i < binaryString.length; i++) {
				uint8Array[i] = binaryString.charCodeAt(i);
			}
			audioSource = arrayBuffer;
		} else {
			const response = await fetch(notificationSound as string);
			audioSource = await response.arrayBuffer();
		}

		audioBufferRef.current = await audioContextRef.current.decodeAudioData(audioSource);
	}, [settings.notification]);

	/**
	 * Plays notification sound.
	 */
	const playNotificationSound = useCallback(() => {
		if (settings.notification?.disabled || !syncedNotificationsToggledOnRef.current || !hasInteractedPage) {
			return;
		}

		if (!audioContextRef.current || !audioBufferRef.current) {
			return;
		}

		const source = audioContextRef.current.createBufferSource();
		source.buffer = audioBufferRef.current;
		source.connect(gainNodeRef.current as AudioNode).connect(audioContextRef.current.destination);
		source.start();
	}, [settings.notification, syncedNotificationsToggledOnRef, hasInteractedPage, audioContextRef,
		audioBufferRef, gainNodeRef]);

	/**
	 * Handles toggling of notification feature.
	 * 
	 * @param active boolean indicating desired state (if not specified, just flips existing state)
	 */
	const toggleNotifications = useCallback(async (active?: boolean) => {
		// nothing to do if state is as desired
		if (active === syncedNotificationsToggledOnRef.current) {
			return;
		}

		// handles toggle notifications event
		if (settings.event?.rcbToggleNotifications) {
			const event = await dispatchRcbEvent(
				RcbEvent.TOGGLE_NOTIFICATIONS, {
					currState: syncedNotificationsToggledOnRef.current,
					newState: !syncedNotificationsToggledOnRef.current
				}
			);
			if (event.defaultPrevented) {
				return;
			}
		}
		setSyncedNotificationsToggledOn(prev => !prev);
	}, [syncedNotificationsToggledOnRef]);

	return {
		unreadCount,
		setUnreadCount,
		notificationsToggledOn,
		toggleNotifications,
		playNotificationSound,
		setUpNotifications
	};
};
