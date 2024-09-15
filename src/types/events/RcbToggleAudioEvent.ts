import { RcbBaseEvent } from "../internal/events/RcbBaseEvent";

/**
 * Defines the data available for toggle audio event.
 */
export type RcbToggleAudioEvent = RcbBaseEvent<{
	currState: boolean;
	newState: boolean;
}>;