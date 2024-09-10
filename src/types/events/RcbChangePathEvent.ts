import { RcbBaseEvent } from "../internal/events/RcbBaseEvent";

/**
 * Defines the data available for change path event.
 */
export type RcbChangePathEvent = RcbBaseEvent<{
    prevPath: string;
    currPath: string;
    nextPath: string;
}>;