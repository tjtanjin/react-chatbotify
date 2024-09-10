import { isValidElement } from "react";

/**
 * Creates a new message with given content and sender.
 *
 * @param content content of the message
 * @param sender sender of the message
 */
export const createMessage = (content: string | JSX.Element, sender: string, ) => {
    return {
        id: crypto.randomUUID(),
        content,
        sender,
        type: isValidElement(content) ? "object" : "string"
    };
}