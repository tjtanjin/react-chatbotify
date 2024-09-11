import { RcbBaseEvent } from "../internal/events/RcbBaseEvent";
import { Message } from "../Message";

/**
 * Defines the data available for start stream message event.
 */
export type RcbStartStreamMessageEvent = RcbBaseEvent<{
    message: Message;
}>;