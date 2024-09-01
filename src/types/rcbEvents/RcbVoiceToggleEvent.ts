import { RcbEvent } from "./RcbEvent";

/**
 * Defines the details available for voice toggle event.
 */
export type RcbVoiceToggleEvent = RcbEvent<{
	toggle: "on" | "off";
    currPath: string;
    prevPath: string;
}>;