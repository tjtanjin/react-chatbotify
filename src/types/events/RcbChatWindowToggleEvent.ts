import { RcbBaseEvent } from "../internal/events/RcbBaseEvent";

/**
 * Defines the data available for chat window toggle event.
 */
export type RcbChatWindowToggleEvent = RcbBaseEvent<{
	toggleState: string;
}>;