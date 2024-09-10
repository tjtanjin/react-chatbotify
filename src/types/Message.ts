/**
 * Defines the attributes within a chat message.
 */
export type Message = {
	id: string;
	content: string | JSX.Element;
	sender: string;
	type: string;
	timestamp: string; // new Date().toUTCString()
}