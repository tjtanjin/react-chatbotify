import { RcbBaseEvent } from "../internal/events/RcbBaseEvent";
import { Message } from "../Message";

/**
 * Defines the data available for start simulated stream message event.
 */
export type RcbStartSimStreamMessageEvent = RcbBaseEvent<{
    message: Message;
    simulateStreamChunker?: (content: string) => Array<string>;
}>;