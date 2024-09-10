/**
 * Defines the attributes within a sent bot/user message.
 */
export type Message = {
	id: string;
	content: string | JSX.Element;
	sender: string;
	type: string;
}