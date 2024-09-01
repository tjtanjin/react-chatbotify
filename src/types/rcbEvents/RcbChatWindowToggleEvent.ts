import { RcbEvent } from "./RcbEvent";

/**
 * Defines the details available for chat window toggle event.
 */
export type RcbChatWindowToggleEvent = RcbEvent<{
	toggle: "on" | "off";
    currPath: string;
    prevPath: string;
}>;