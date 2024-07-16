import { Flow } from "./Flow";

/**
 * Defines the accessible data for use in dynamic attributes.
 */
export type Params = {
	userInput: string,
	prevPath: keyof Flow | null
	injectMessage: (content: string | JSX.Element, sender?: string) => Promise<void>;
	streamMessage: (content: string | JSX.Element, sender?: string) => Promise<void>;
	openChat: (isOpen: boolean) => void;
	files?: FileList;
}