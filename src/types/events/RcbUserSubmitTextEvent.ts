import { RcbBaseEvent } from "../internal/events/RcbBaseEvent";

/**
 * Defines the data available for user submit text event.
 */
export type RcbUserSubmitTextEvent = RcbBaseEvent<{
    userInput: string;
}>;