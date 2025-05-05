import { Block } from "../Block";
import { RcbBaseEvent } from "../internal/events/RcbBaseEvent";

/**
 * Defines the data available for pre-process block event.
 */
export type RcbPreProcessBlockEvent = RcbBaseEvent<{
    block: Block;
}>;