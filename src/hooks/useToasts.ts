import { useToastsInternal } from "./internal/useToastsInternal";

/**
 * External custom hook for managing toasts.
 */
export const useToasts = () => {
	// handles toasts
	const { showToast, dismissToast, toasts, setToasts } = useToastsInternal();

	return {
		showToast,
		dismissToast,
		toasts,
		setToasts
	};
};
