import { useContext, createContext, Dispatch, SetStateAction, MutableRefObject } from "react";

import { Toast } from "../types/Toast";
import { useSyncedRefState } from "../hooks/internal/useSyncedRefState";

/**
 * Creates the useToastsContext() hook to manage toasts.
 */
type ToastsContextType = {
	toasts: Toast[];
	setSyncedToasts: Dispatch<SetStateAction<Toast[]>>;
	syncedToastsRef: MutableRefObject<Toast[]>;
};
const ToastsContext = createContext<ToastsContextType>({
	toasts: [],
	setSyncedToasts: () => {},
	syncedToastsRef: {current: []}
});
const useToastsContext = () => useContext(ToastsContext);

/**
 * Creates provider to wrap the chatbot container.
 */
const ToastsProvider = ({ children }: { children: React.ReactNode }) => {
	// handles toasts shown in the chatbot
	const [toasts, setSyncedToasts, syncedToastsRef] = useSyncedRefState<Toast[]>([]);

	return (
		<ToastsContext.Provider value={{ toasts, setSyncedToasts, syncedToastsRef }}>
			{children}
		</ToastsContext.Provider>
	);
};

export { useToastsContext, ToastsProvider };
