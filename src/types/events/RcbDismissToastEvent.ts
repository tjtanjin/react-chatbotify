import { Toast } from "../Toast";
import { RcbBaseEvent } from "../internal/events/RcbBaseEvent";

/**
 * Defines the data available for dismiss toast event.
 */
export type RcbDismissToastEvent = RcbBaseEvent<{
    toast: Toast;
}>;
