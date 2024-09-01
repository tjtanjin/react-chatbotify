import { RcbEvent } from "./RcbEvent";
import { Message } from "../Message";

/**
 * Defines the details available for start message stream event.
 */
export type RcbStartMessageStreamEvent = RcbEvent<{
	message: Message;
    currPath: string;
    prevPath: string;
}>;