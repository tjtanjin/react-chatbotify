import { RcbBaseEvent } from "../internal/events/RcbBaseEvent";

/**
 * Defines the data available for notification toggle event.
 */
export type RcbNotificationToggleEvent = RcbBaseEvent<{
	toggleState: string;
}>;