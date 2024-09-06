import { Flow } from "./Flow";

/**
 * Defines the accessible data for use in dynamic attributes.
 */
export type Params = {
	userInput: string;
	prevPath: keyof Flow | null;
	goToPath: (pathToGo: keyof Flow) => void;
	setTextAreaValue: (value: string) => void;
	injectMessage: (content: string | JSX.Element, sender?: string, bypassEvents?: boolean) => Promise<void>;
	streamMessage: (content: string | JSX.Element, sender?: string) => Promise<void>;
	injectToast: (content: string | JSX.Element, timeout?: number) => void;
	openChat: (isOpen: boolean) => void;
	files?: FileList;
}