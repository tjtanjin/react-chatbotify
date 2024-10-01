import { useContext, createContext, Dispatch, SetStateAction, useState } from "react";

import { Message } from "../types/Message";

/**
 * Creates the useMessagesContext() hook to manage messages.
 */
type MessagesContextType = {
	messages: Message[];
	setMessages: Dispatch<SetStateAction<Message[]>>;
};
const MessagesContext = createContext<MessagesContextType>({messages: [], setMessages: () => null});
const useMessagesContext = () => useContext(MessagesContext);

/**
 * Creates provider to wrap the chatbot container.
 */
const MessagesProvider = ({ children }: { children: React.ReactNode }) => {
	const [messages, setMessages] = useState<Message[]>([]);
	return (
		<MessagesContext.Provider value={{ messages, setMessages }}>
			{children}
		</MessagesContext.Provider>
	);
};

export { useMessagesContext, MessagesProvider };
