/**
 * Defines the attributes within a sent bot/user message.
 */
export type Message = {
	content: string | JSX.Element;
	type: string;
	isUser: boolean;
	timestamp: Date | null;
}