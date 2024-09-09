import { Toast } from "../Toast";
import { RcbBaseEvent } from "../internal/events/RcbBaseEvent";

/**
 * Defines the data available for show toast event.
 */
export type RcbShowToastEvent = RcbBaseEvent<{
    toast: Toast;
}>;
