import { RcbBaseEvent } from "../internal/events/RcbBaseEvent";

/**
 * Defines the data available for voice toggle event.
 */
export type RcbVoiceToggleEvent = RcbBaseEvent<{
	toggleState: string;
}>;