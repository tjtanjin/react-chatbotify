import { RcbEvent } from "./RcbEvent";

/**
 * Defines the details available for audio toggle event.
 */
export type RcbAudioToggleEvent = RcbEvent<{
	toggle: "on" | "off";
    currPath: string;
    prevPath: string;
}>;