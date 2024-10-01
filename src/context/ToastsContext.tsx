import { useContext, createContext, Dispatch, SetStateAction, useState } from "react";

import { Toast } from "../types/Toast";

/**
 * Creates the useToastsContext() hook to manage toasts.
 */
type ToastsContextType = {
	toasts: Toast[];
	setToasts: Dispatch<SetStateAction<Toast[]>>;
};
const ToastsContext = createContext<ToastsContextType>({toasts: [], setToasts: () => null});
const useToastsContext = () => useContext(ToastsContext);

/**
 * Creates provider to wrap the chatbot container.
 */
const ToastsProvider = ({ children }: { children: React.ReactNode }) => {
	// handles toasts shown in the chatbot
	const [toasts, setToasts] = useState<Toast[]>([]);

	return (
		<ToastsContext.Provider value={{ toasts, setToasts }}>
			{children}
		</ToastsContext.Provider>
	);
};

export { useToastsContext, ToastsProvider };
