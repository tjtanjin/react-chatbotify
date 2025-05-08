import { Message } from "../Message";

/**
 * Action types for message operations.
 */
export type MessagesAction =
    | { type: "ADD"; payload: Message }
    | { type: "REMOVE"; payload: string }
    | { type: "REPLACE"; payload: Message[] }
    | { type: "UPDATE"; payload: Message };
