import { RcbBaseEvent } from "../internal/events/RcbBaseEvent";

/**
 * Defines the data available for stop stream message event.
 */
export type RcbTextareaChangeValueEvent = RcbBaseEvent<{
    currValue: string;
    prevValue: string;
}>;