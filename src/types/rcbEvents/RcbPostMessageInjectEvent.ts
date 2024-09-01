import { RcbEvent } from "./RcbEvent";
import { Message } from "../Message";

/**
 * Defines the details available for post-message inject event.
 */
export type RcbPostMessageInjectEvent = RcbEvent<{
	message: Message;
    currPath: string;
    prevPath: string;
}>;