import { RcbEvent } from "./RcbEvent";
import { Message } from "../Message";

/**
 * Defines the details available for stop message stream event.
 */
export type RcbStopMessageStreamEvent = RcbEvent<{
	message: Message;
    currPath: string;
    prevPath: string;
}>;