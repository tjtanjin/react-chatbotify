import { RcbBaseEvent } from "../internal/events/RcbBaseEvent";
import { Message } from "../Message";

/**
 * Defines the data available for stop simulated stream message event.
 */
export type RcbStopSimulateStreamMessageEvent = RcbBaseEvent<{
    message: Message;
}>;