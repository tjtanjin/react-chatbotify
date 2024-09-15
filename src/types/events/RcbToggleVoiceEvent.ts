import { RcbBaseEvent } from "../internal/events/RcbBaseEvent";

/**
 * Defines the data available for toggle voice event.
 */
export type RcbToggleVoiceEvent = RcbBaseEvent<{
	currState: boolean;
	newState: boolean;
}>;