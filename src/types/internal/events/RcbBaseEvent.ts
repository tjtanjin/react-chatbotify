import { EventDetail } from "./EventDetail";

/**
 * Base rcb event which specifies custom event fields.
 */
export type RcbBaseEvent<T = any, U = EventDetail> = CustomEvent<U> & {
    data: T;
};
