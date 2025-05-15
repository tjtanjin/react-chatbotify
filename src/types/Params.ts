import { Flow } from "./Flow";
import { Message } from "./Message";

/**
 * Defines the accessible data for use in dynamic attributes.
 */
export type Params = {
	userInput: string;
	currPath: keyof Flow | null;
	prevPath: keyof Flow | null;
	files?: Array<File>;
	goToPath: (pathToGo: keyof Flow) => Promise<boolean>;
	setTextAreaValue: (value: string) => Promise<void>;
	injectMessage: (content: string | JSX.Element, sender?: string) => Promise<Message | null>;
	simulateStreamMessage: (content: string, sender?: string,
		simulateStreamChunker?: ((content: string) => Array<string>)) => Promise<Message | null>;
	streamMessage: (content: string | JSX.Element, sender?: string) => Promise<Message | null>;
	removeMessage: (id: string) => Promise<Message | null>;
	endStreamMessage: (sender: string) => Promise<boolean>;
	showToast: (content: string | JSX.Element, timeout?: number) => Promise<string | null>;
	dismissToast: (id: string) => Promise<string | null>;
	toggleChatWindow: (isOpen: boolean) => Promise<void>;
}