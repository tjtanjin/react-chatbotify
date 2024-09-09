import { RcbBaseEvent } from "../internal/events/RcbBaseEvent";
import { Message } from "../Message";

/**
 * Defines the data available for post-inject message event.
 */
export type RcbPostInjectMessageEvent = RcbBaseEvent<{
	message: Message;
}>;