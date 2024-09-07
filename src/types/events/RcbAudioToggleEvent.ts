import { RcbBaseEvent } from "../internal/events/RcbBaseEvent";

/**
 * Defines the data available for audio toggle event.
 */
export type RcbAudioToggleEvent = RcbBaseEvent<{
	toggleState: string;
}>;