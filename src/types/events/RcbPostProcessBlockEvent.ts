import { Block } from "../Block";
import { RcbBaseEvent } from "../internal/events/RcbBaseEvent";

/**
 * Defines the data available for post-process block event.
 */
export type RcbPostProcessBlockEvent = RcbBaseEvent<{
    block: Block;
}>;