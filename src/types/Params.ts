import { Flow } from "./Flow";

/**
 * Defines the accessible data for use in dynamic attributes.
 */
export type Params = {
	userInput: string;
	prevPath: keyof Flow | null;
	goToPath: (pathToGo: keyof Flow) => void;
	setTextAreaValue: (value: string) => void;
	injectMessage: (content: string | JSX.Element, sender?: string) => Promise<string | null>;
	streamMessage: (content: string | JSX.Element, sender?: string) => Promise<string | null>;
	removeMessage: (id: string) => Promise<string | null>;
	endStreamMessage: (sender: string) => Promise<boolean>;
	showToast: (content: string | JSX.Element, timeout?: number) => void;
	dismissToast: (id: string) => string | null;
	openChat: (isOpen: boolean) => void;
	files?: FileList;
}