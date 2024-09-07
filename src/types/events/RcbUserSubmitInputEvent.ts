import { RcbBaseEvent } from "../internal/events/RcbBaseEvent";

/**
 * Defines the data available for user submit input event.
 */
export type RcbUserSubmitInputEvent = RcbBaseEvent<{
    userInput: string;
}>;