/**
 * Defines the accessible data for use in dynamic attributes.
 */
export type Params = {
	userInput: string,
	prevPath: string | null
	injectMessage: (content: string | JSX.Element, sender?: string) => void;
	streamMessage: (content: string | JSX.Element, sender?: string) => void;
	openChat: (isOpen: boolean) => void;
	files?: FileList;
}