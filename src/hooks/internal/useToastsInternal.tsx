import { useCallback, useEffect, useRef } from "react";

import { generateSecureUUID } from "../../utils/idGenerator";
import { useRcbEventInternal } from "./useRcbEventInternal";
import { useToastsContext } from "../../context/ToastsContext";
import { useSettingsContext } from "../../context/SettingsContext";
import { Toast } from "../../types/Toast";
import { RcbEvent } from "../../constants/RcbEvent";

/**
 * Internal custom hook for managing toasts.
 */
export const useToastInternal = () => {
	// handles settings
	const { settings } = useSettingsContext();

	// handles toasts
	const { toasts, setToasts } = useToastsContext();

	// handles rcb events
	const { callRcbEvent } = useRcbEventInternal();

	// tracks the toast state
	const toastsRef = useRef<Array<Toast>>(toasts);
	useEffect(() => {
		toastsRef.current = toasts;
	}, [toasts]);

	/**
	 * Injecs a new toast.
	 *
	 * @param content message to show in toast
	 * @param timeout optional timeout in milliseconds before toast is removed
	 */
	const showToast = useCallback((content: string | JSX.Element, timeout?: number): string | null => {
		let id = null;
		const currentToasts = toastsRef.current;
		const numToast = currentToasts.length;

		if (numToast >= (settings.toast?.maxCount ?? 3)) {
			if (settings.toast?.forbidOnMax) {
				return null;
			}
			id = generateSecureUUID();
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
			return id;
		}
		id = generateSecureUUID();
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
	}, [settings, callRcbEvent, setToasts]);

	/**
	 * Removes a toast.
	 *
	 * @param id id of toast to remove
	 */
	const dismissToast = useCallback((id: string): string | null => {
		const toastToRemove = toasts.find((toast) => toast.id === id);

		// if cannot find toast, nothing to remove
		if (!toastToRemove) {
			return null;
		}

		// handles dismiss toast event
		if (settings.event?.rcbDismissToast) {
			const event = callRcbEvent(RcbEvent.DISMISS_TOAST, { toast: toastToRemove });
			// if prevented, don't dismiss
			if (event.defaultPrevented) {
				return null;
			}
		}

		// dismiss toast
		setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
		return id;
	}, [callRcbEvent, setToasts]);

	return {
		showToast,
		dismissToast,
		toasts,
		setToasts
	};
};
