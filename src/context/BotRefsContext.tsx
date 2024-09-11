import { createContext, useContext, useRef } from "react";

import { Flow } from "../types/Flow";

/**
 * Creates the useBotRefsContext() hook to manage common refs.
 */
type BotRefsContextType = {
	flowRef: React.RefObject<Flow>;
	inputRef: React.RefObject<HTMLTextAreaElement | HTMLInputElement>;
	streamMessageMap: React.MutableRefObject<Map<string, string>>;
	chatBodyRef: React.RefObject<HTMLDivElement>;
	paramsInputRef: React.MutableRefObject<string>;
	keepVoiceOnRef: React.MutableRefObject<boolean>;
};
const BotRefsContext = createContext<BotRefsContextType>({} as BotRefsContextType);
const useBotRefsContext = () => useContext(BotRefsContext);

/**
 * Creates provider to wrap the chatbot container.
 */
const BotRefsProvider = ({
	children,
	initialFlow,
}: {
	children: JSX.Element
	initialFlow: Flow
}) => {
	const flowRef = useRef<Flow>(initialFlow);
	const inputRef = useRef<HTMLTextAreaElement | HTMLInputElement>(null);
	const streamMessageMap = useRef<Map<string, string>>(new Map());
	const chatBodyRef = useRef<HTMLDivElement>(null);
	const paramsInputRef = useRef<string>("");
	const keepVoiceOnRef = useRef<boolean>(false);

	return (
		<BotRefsContext.Provider value={{
			flowRef,
			inputRef,
			streamMessageMap,
			chatBodyRef,
			paramsInputRef,
			keepVoiceOnRef
		}}>
			{children}
		</BotRefsContext.Provider>
	);
};

export { useBotRefsContext, BotRefsProvider };
