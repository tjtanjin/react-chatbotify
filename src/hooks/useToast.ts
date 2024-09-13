import { useCallback } from "react";

import { useRcbEventInternal } from "./internal/useRcbEventInternal";
import { useToastsContext } from "../context/ToastsContext";
import { useSettingsContext } from "../context/SettingsContext";
import { RcbEvent } from "../constants/RcbEvent";

/**
 * External custom hook for managing toasts.
 */
export const useToast = () => {
	// handles settings
	const { settings } = useSettingsContext();

	// handles toasts
	const { toasts, setToasts } = useToastsContext();

	// handles rcb events
	const { callRcbEvent } = useRcbEventInternal();

	/**
	 * Injects a new toast.
	 *
	 * @param content message to show in toast
	 * @param timeout optional timeout in milliseconds before toast is removed
	 */
	const showToast = useCallback((content: string | JSX.Element, timeout?: number): string | null => {
		let id = null;
		if (toasts.length >= (settings.toast?.maxCount || 3)) {
			if (settings.toast?.forbidOnMax) {
				return null;
			}
			id = crypto.randomUUID();
			let toast = { id, content, timeout };

			// handles show toast event
			if (settings.event?.rcbShowToast) {
				const event = callRcbEvent(RcbEvent.SHOW_TOAST, { toast });
				if (event.defaultPrevented) {
					return null;
				}
				toast = event.data.toast;
			}
			setToasts(prevToasts => [...prevToasts.slice(1), toast]);
		}
		id = crypto.randomUUID();
		let toast = { id, content, timeout };

		// handles show toast event
		if (settings.event?.rcbShowToast) {
			const event = callRcbEvent(RcbEvent.SHOW_TOAST, { toast });
			if (event.defaultPrevented) {
				return null;
			}
			toast = event.data.toast;
		}

		setToasts(prevToasts => [...prevToasts, toast]);
		return id;
	}, [settings, callRcbEvent]);

	/**
	 * Removes a toast.
	 *
	 * @param id id of toast to remove
	 */
	const dismissToast = useCallback((id: string): void => {
		const toastToRemove = toasts.find((toast) => toast.id === id);

		// if cannot find toast, nothing to remove
		if (!toastToRemove) {
			return;
		}

		// handles dismiss toast event
		if (settings.event?.rcbDismissToast) {
			const event = callRcbEvent(RcbEvent.DISMISS_TOAST, { toast: toastToRemove });
			// if prevented, don't dismiss
			if (event.defaultPrevented) {
				return;
			}
		}

		// dismiss toast
		setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
	}, []);

	return {
		showToast,
		dismissToast,
		toasts,
		setToasts
	};
};
