import { RcbBaseEvent } from "../internal/events/RcbBaseEvent";
import { Message } from "../Message";

/**
 * Defines the data available for pre-inject message event.
 */
export type RcbPreInjectMessageEvent = RcbBaseEvent<{
	message: Message;
}>;