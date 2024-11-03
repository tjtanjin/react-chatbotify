import { Flow } from "./Flow";

/**
 * Defines the accessible data for use in dynamic attributes.
 */
export type Params = {
	userInput: string;
	currPath: keyof Flow | null;
	prevPath: keyof Flow | null;
	files?: FileList;
	goToPath: (pathToGo: keyof Flow) => Promise<boolean>;
	setTextAreaValue: (value: string) => Promise<void>;
	injectMessage: (content: string | JSX.Element, sender?: string) => Promise<string | null>;
	streamMessage: (content: string | JSX.Element, sender?: string) => Promise<string | null>;
	removeMessage: (id: string) => Promise<string | null>;
	endStreamMessage: (sender: string) => Promise<boolean>;
	showToast: (content: string | JSX.Element, timeout?: number) => Promise<string | null>;
	dismissToast: (id: string) => Promise<string | null>;
	openChat: (isOpen: boolean) => Promise<void>;
}