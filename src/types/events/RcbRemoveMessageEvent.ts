import { RcbBaseEvent } from "../internal/events/RcbBaseEvent";
import { Message } from "../Message";

/**
 * Defines the data available for stop stream message event.
 */
export type RcbRemoveMessageEvent = RcbBaseEvent<{
    message: Message;
}>;