import { RcbBaseEvent } from "../internal/events/RcbBaseEvent";

/**
 * Defines the data available for user upload file event.
 */
export type RcbUserUploadFileEvent = RcbBaseEvent<{
    files: FileList
}>;