import { useContext, createContext, Dispatch, SetStateAction, MutableRefObject } from "react";

import { Message } from "../types/Message";
import { useSyncedRefState } from "../hooks/internal/useSyncedRefState";

/**
 * Creates the useMessagesContext() hook to manage messages.
 */
type MessagesContextType = {
	messages: Message[];
	setSyncedMessages: Dispatch<SetStateAction<Message[]>>;
	syncedMessagesRef: MutableRefObject<Message[]>;
};
const MessagesContext = createContext<MessagesContextType>({
	messages: [],
	setSyncedMessages: () => {},
	syncedMessagesRef: {current: []}
});
const useMessagesContext = () => useContext(MessagesContext);

/**
 * Creates provider to wrap the chatbot container.
 */
const MessagesProvider = ({ children }: { children: React.ReactNode }) => {
	const [messages, setSyncedMessages, syncedMessagesRef] = useSyncedRefState<Message[]>([]);
	return (
		<MessagesContext.Provider value={{ messages, setSyncedMessages, syncedMessagesRef }}>
			{children}
		</MessagesContext.Provider>
	);
};

export { useMessagesContext, MessagesProvider };