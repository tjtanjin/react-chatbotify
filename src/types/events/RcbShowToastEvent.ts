import { RcbBaseEvent } from "../internal/events/RcbBaseEvent";
import { Toast } from "../internal/Toast";

/**
 * Defines the data available for show toast event.
 */
export type RcbShowToastEvent = RcbBaseEvent<{
    toast: Toast;
}>;