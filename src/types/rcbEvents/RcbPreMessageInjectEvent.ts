import { RcbEvent } from "./RcbEvent";
import { Message } from "../Message";

/**
 * Defines the details available for pre-message inject event.
 */
export type RcbPreMessageInjectEvent = RcbEvent<{
	message: Message;
    currPath: string;
    prevPath: string;
}>;