import React, {
	createContext,
	useContext,
	useReducer,
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
const useMessagesContext = (): MessagesContextType => useContext(MessagesContext);

/**
 * Declares ref outside reducer so it can be synced inline with state.
 */
const messagesRef = { current: [] as Message[] };

/**
 * Creates a reducer for managing message state transitions.
 */
const messagesReducer = (state: Message[], action: MessagesAction): Message[] => {
	let newState = state;
	switch (action.type) {
	case "ADD":
		newState = [...state, action.payload];
		break;
	case "REMOVE":
		newState = state.filter((m) => m.id !== action.payload);
		break;
	case "REPLACE":
		newState = action.payload;
		break;
	case "UPDATE":
		newState = state.map((m) =>
			m.id === action.payload.id ? action.payload : m
		);
		break;
	}
	// Sync the ref immediately inside reducer
	messagesRef.current = newState;
	return newState;
};

/**
 * Creates provider to wrap the chatbot container.
 */
const MessagesProvider = ({ children }: { children: ReactNode }) => {
	const [messages, dispatch] = useReducer(messagesReducer, []);
	return (
		<MessagesContext.Provider value={{ messages, dispatch, messagesRef }}>
			{children}
		</MessagesContext.Provider>
	);
};

export { useMessagesContext, MessagesProvider }
