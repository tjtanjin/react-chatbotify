import { RcbEvent } from "./RcbEvent";
import { Message } from "../Message";

/**
 * Defines the details available for chunk message stream event.
 */
export type RcbChunkMessageStreamEvent = RcbEvent<{
	message: Message;
    currPath: string;
    prevPath: string;
}>;