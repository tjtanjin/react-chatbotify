import { RcbBaseEvent } from "../internal/events/RcbBaseEvent";

/**
 * Defines the data available for stop stream message event.
 */
export type RcbTextAreaChangeValueEvent = RcbBaseEvent<{
    currValue: string;
    prevValue: string;
}>;