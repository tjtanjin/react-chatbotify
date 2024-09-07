import { RcbBaseEvent } from "../internal/events/RcbBaseEvent";
import { Message } from "../Message";

/**
 * Defines the data available for pre-message inject event.
 */
export type RcbPreMessageInjectEvent = RcbBaseEvent<{
	message: Message;
}>;