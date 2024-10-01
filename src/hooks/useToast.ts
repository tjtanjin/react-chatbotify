import { useToastInternal } from "./internal/useToastInternal";

/**
 * External custom hook for managing toasts.
 */
export const useToast = () => {
	// handles toasts
	const { showToast, dismissToast, toasts, setToasts } = useToastInternal();

	return {
		showToast,
		dismissToast,
		toasts,
		setToasts
	};
};
