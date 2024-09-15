import { RcbBaseEvent } from "../internal/events/RcbBaseEvent";

/**
 * Defines the data available for toggle notifications event.
 */
export type RcbToggleNotificationsEvent = RcbBaseEvent<{
	currState: boolean;
	newState: boolean;
}>;