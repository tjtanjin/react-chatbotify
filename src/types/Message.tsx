/**
 * Defines the attributes within a sent bot/user message.
 */
export type Message = {
	content: string | JSX.Element;
	type: string;
	sender: string;
	isHistory?: boolean;
	timestamp?: Date;
}