import { RcbEvent } from "./RcbEvent";

/**
 * Defines the details available for chat history load event.
 */
export type RcbChatHistoryLoadEvent = RcbEvent<{
	history: string[];
	currPath: string;
    prevPath: string;
}>;