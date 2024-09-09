import { createContext, useContext, useRef } from "react";

/**
 * Creates the useBotRefsContext() hook to manage common refs.
 */
type BotRefsContextType = {
	inputRef: React.RefObject<HTMLTextAreaElement | HTMLInputElement>;
	isBotStreamingRef: React.MutableRefObject<boolean>;
	chatBodyRef: React.RefObject<HTMLDivElement>;
	paramsInputRef: React.MutableRefObject<string>;
	keepVoiceOnRef: React.MutableRefObject<boolean>;
};
const BotRefsContext = createContext<BotRefsContextType>({} as BotRefsContextType);
const useBotRefsContext = () => useContext(BotRefsContext);

/**
 * Creates provider to wrap the chatbot container.
 */
const BotRefsProvider = ({ children }: { children: JSX.Element }) => {
	// Define your refs here
	const inputRef = useRef<HTMLTextAreaElement | HTMLInputElement>(null);
	const isBotStreamingRef = useRef<boolean>(false);
	const chatBodyRef = useRef<HTMLDivElement>(null);
	const paramsInputRef = useRef<string>("");
	const keepVoiceOnRef = useRef<boolean>(false);

	return (
		<BotRefsContext.Provider value={{ inputRef, isBotStreamingRef, chatBodyRef, paramsInputRef, keepVoiceOnRef }}>
			{children}
		</BotRefsContext.Provider>
	);
};

export { useBotRefsContext, BotRefsProvider };
