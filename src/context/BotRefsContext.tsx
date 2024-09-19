import React, { createContext, useContext, useRef } from "react";

import { Flow } from "../types/Flow";

/**
 * Creates the useBotRefsContext() hook to manage common refs.
 */
type BotRefsContextType = {
	botIdRef: React.RefObject<string>;
	flowRef: React.RefObject<Flow>;
	inputRef: React.RefObject<HTMLTextAreaElement | HTMLInputElement>;
	prevInputRef: React.MutableRefObject<string>;
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
	id,
	initialFlow,
}: {
	children: JSX.Element
	id: string;
	initialFlow: Flow
}) => {
	const botIdRef = useRef<string>(id);
	const flowRef = useRef<Flow>(initialFlow);
	const inputRef = useRef<HTMLTextAreaElement | HTMLInputElement>(null);
	const prevInputRef = useRef<string>("");
	const streamMessageMap = useRef<Map<string, string>>(new Map());
	const chatBodyRef = useRef<HTMLDivElement>(null);
	const paramsInputRef = useRef<string>("");
	const keepVoiceOnRef = useRef<boolean>(false);

	// always ensures that the ref is in sync with the latest flow
	// necessary for state updates in user-provided flows to be reflected timely
	if (flowRef.current !== initialFlow) {
		flowRef.current = initialFlow;
	}

	return (
		<BotRefsContext.Provider value={{
			botIdRef,
			flowRef,
			inputRef,
			streamMessageMap,
			chatBodyRef,
			paramsInputRef,
			keepVoiceOnRef,
			prevInputRef
		}}>
			{children}
		</BotRefsContext.Provider>
	);
};

export { useBotRefsContext, BotRefsProvider };
