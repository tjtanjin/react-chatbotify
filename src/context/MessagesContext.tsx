import { useContext, createContext, Dispatch, SetStateAction, MutableRefObject } from "react";

import { Message } from "../types/Message";
import { useSyncedRefState } from "../hooks/internal/useSyncedRefState";

/**
 * Creates the useMessagesContext() hook to manage messages.
 */
type MessagesContextType = {
	messages: Message[];
	setSyncMessages: Dispatch<SetStateAction<Message[]>>;
	messagesSyncRef: MutableRefObject<Message[]>;
};
const MessagesContext = createContext<MessagesContextType>({
	messages: [],
	setSyncMessages: () => {},
	messagesSyncRef: {current: []}
});
const useMessagesContext = () => useContext(MessagesContext);

/**
 * Creates provider to wrap the chatbot container.
 */
const MessagesProvider = ({ children }: { children: React.ReactNode }) => {
	const [messages, setSyncMessages, messagesSyncRef] = useSyncedRefState<Message[]>([]);
	return (
		<MessagesContext.Provider value={{ messages, setSyncMessages, messagesSyncRef }}>
			{children}
		</MessagesContext.Provider>
	);
};

export { useMessagesContext, MessagesProvider };