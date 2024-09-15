import { RcbBaseEvent } from "../internal/events/RcbBaseEvent";
import { Message } from "../Message";

/**
 * Defines the data available for chunk stream message event.
 */
export type RcbChunkStreamMessageEvent = RcbBaseEvent<{
	message: Message;
}>;