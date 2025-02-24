import { RcbBaseEvent } from "../internal/events/RcbBaseEvent";

/**
 * Defines the data available for start speak audio event.
 */
export type RcbStartSpeakAudioEvent = RcbBaseEvent<{
    textToRead: string;
}>;