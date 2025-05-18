import { useCallback } from "react";

import { generateSecureUUID } from "../../utils/idGenerator";
import { useDispatchRcbEventInternal } from "./useDispatchRcbEventInternal";
import { useToastsContext } from "../../context/ToastsContext";
import { useSettingsContext } from "../../context/SettingsContext";
import { Toast } from "../../types/Toast";
import { RcbEvent } from "../../constants/RcbEvent";

/**
 * Internal custom hook for managing toasts.
 */
export const useToastsInternal = () => {
	// handles settings
	const { settings } = useSettingsContext();

	// handles toasts
	const { toasts, setSyncedToasts, syncedToastsRef } = useToastsContext();

	// handles rcb events
	const { dispatchRcbEvent } = useDispatchRcbEventInternal();

	/**
	 * Injecs a new toast.
	 *
	 * @param content message to show in toast
	 * @param timeout optional timeout in milliseconds before toast is removed
	 */
	const showToast = useCallback(async (content: string | JSX.Element, timeout?: number): Promise<string | null> => {
		let id = null;
		const currentToasts = syncedToastsRef.current;
		const numToast = currentToasts.length;

		if (numToast >= (settings.toast?.maxCount ?? 3)) {
			if (settings.toast?.forbidOnMax) {
				return null;
			}
			id = generateSecureUUID();
			let toast = { id, content, timeout };

			// handles show toast event
			if (settings.event?.rcbShowToast) {
				const event = await dispatchRcbEvent(RcbEvent.SHOW_TOAST, { toast });
				if (event.defaultPrevented) {
					return null;
				}
				toast = event.data.toast;
			}
			setSyncedToasts(prevToasts => [...prevToasts.slice(1), toast]);
			return id;
		}
		id = generateSecureUUID();
		let toast = { id, content, timeout };

		// handles show toast event
		if (settings.event?.rcbShowToast) {
			const event = await dispatchRcbEvent(RcbEvent.SHOW_TOAST, { toast });
			if (event.defaultPrevented) {
				return null;
			}
			toast = event.data.toast;
		}

		setSyncedToasts(prevToasts => [...prevToasts, toast]);
		return id;
	}, [settings, dispatchRcbEvent]);

	/**
	 * Removes a toast.
	 *
	 * @param id id of toast to remove
	 */
	const dismissToast = useCallback(async (id: string): Promise<string | null> => {
		const toastToRemove = syncedToastsRef.current.find((toast) => toast.id === id);

		// if cannot find toast, nothing to remove
		if (!toastToRemove) {
			return null;
		}

		// handles dismiss toast event
		if (settings.event?.rcbDismissToast) {
			const event = await dispatchRcbEvent(RcbEvent.DISMISS_TOAST, { toast: toastToRemove });
			// if prevented, don't dismiss
			if (event.defaultPrevented) {
				return null;
			}
		}

		// dismiss toast
		setSyncedToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
		return id;
	}, [dispatchRcbEvent]);

	/**
	 * Replaces (overwrites entirely) the current toasts with the new toasts.
	 * 
	 * @param newToasts new toasts to set/replace
	 */
	const replaceToasts = useCallback((newToasts: Array<Toast>) => {
		setSyncedToasts(newToasts);
	}, [])

	return {
		showToast,
		dismissToast,
		toasts,
		replaceToasts
	};
};
