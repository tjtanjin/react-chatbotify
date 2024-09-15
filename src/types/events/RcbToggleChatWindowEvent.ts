import { RcbBaseEvent } from "../internal/events/RcbBaseEvent";

/**
 * Defines the data available for toggle chat window event.
 */
export type RcbToggleChatWindowEvent = RcbBaseEvent<{
	currState: boolean;
	newState: boolean;
}>;