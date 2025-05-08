import React, {
	createContext,
	useContext,
	useReducer,
	useRef,
	useEffect,
	ReactNode,
	Dispatch,
} from "react";
import { Message } from "../types/Message";
import { MessagesAction } from "../types/internal/MessageAction";

/**
 * Creates the useMessagesContext() hook to manage messages.
 */
type MessagesContextType = {
	messages: Message[];
	dispatch: Dispatch<MessagesAction>;
	messagesRef: React.MutableRefObject<Message[]>;
};

const MessagesContext = createContext<MessagesContextType>({
	messages: [],
	dispatch: () => null,
	messagesRef: { current: [] },
});
const useMessagesContext = (): MessagesContextType =>
	useContext(MessagesContext);


/**
 * Creates a reducer for managing message state transitions.
 */
const messagesReducer = (state: Message[], action: MessagesAction): Message[] => {
	switch (action.type) {
	case "ADD":
		return [...state, action.payload];
	case "REMOVE":
		return state.filter((m) => m.id !== action.payload);
	case "REPLACE":
		return action.payload;
	case "UPDATE":
		return state.map((m) =>
			m.id === action.payload.id ? action.payload : m
		);
	default:
		return state;
	}
};


/**
 * Creates provider to wrap the chatbot container.
 */
const MessagesProvider = ({ children }: { children: ReactNode }) => {
	// Use reducer for atomic message operations
	const [messages, dispatch] = useReducer(messagesReducer, []);
	// Ref tracks latest messages for non-render logic
	const messagesRef = useRef<Message[]>(messages);

	// Sync the ref whenever messages state changes
	useEffect(() => {
		messagesRef.current = messages;
	}, [messages]);

	return (
		<MessagesContext.Provider value={{ messages, dispatch, messagesRef }}>
			{children}
		</MessagesContext.Provider>
	);
};

export { useMessagesContext, MessagesProvider }