import { useContext, createContext, Dispatch, SetStateAction } from "react";

import { Message } from "../types/Message";

/**
 * Creates the useMessages() hook to manage messages.
 */
type MessagesContextType = {
	messages: Message[]
	setMessages: Dispatch<SetStateAction<Message[]>>;
}
const MessagesContext = createContext<MessagesContextType>({messages: [], setMessages: () => null});
const useMessages = () => useContext(MessagesContext);

export {
	MessagesContext,
	useMessages
};