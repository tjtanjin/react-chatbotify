import { RcbBaseEvent } from "../internal/events/RcbBaseEvent";
import { Message } from "../Message";

/**
 * Defines the data available for chunk message stream event.
 */
export type RcbChunkMessageStreamEvent = RcbBaseEvent<{
	message: Message;
	chunk: string;
}>;