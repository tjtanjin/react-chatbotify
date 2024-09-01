import { RcbEvent } from "./RcbEvent";

/**
 * Defines the details available for notification toggle event.
 */
export type RcbNotificationToggleEvent = RcbEvent<{
	toggle: "on" | "off";
    currPath: string;
    prevPath: string;
}>;