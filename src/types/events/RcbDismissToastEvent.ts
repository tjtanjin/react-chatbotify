import { RcbBaseEvent } from "../internal/events/RcbBaseEvent";
import { Toast } from "../internal/Toast";

/**
 * Defines the data available for dismiss toast event.
 */
export type RcbDismissToastEvent = RcbBaseEvent<{
    toast: Toast;
}>;