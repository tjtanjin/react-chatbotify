import { RcbBaseEvent } from "../internal/events/RcbBaseEvent";
import { Message } from "../Message";

/**
 * Defines the data available for post-message inject event.
 */
export type RcbPostMessageInjectEvent = RcbBaseEvent<{
	message: Message;
}>;