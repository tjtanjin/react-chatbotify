import { useToastsInternal } from "./internal/useToastsInternal";

/**
 * External custom hook for managing toasts.
 */
export const useToasts = () => {
	// handles toasts
	const { showToast, dismissToast, toasts, replaceToasts } = useToastsInternal();

	return {
		showToast,
		dismissToast,
		toasts,
		replaceToasts
	};
};
