import { Params } from "./Params";

/**
 * Defines the attributes allowed within a conversation block.
 */
export type Block = {
	// pre-processing attributes (runs on block entry)
	// for developers of this library - the "isSensitive" attribute is technically processed only when user sends an
	// input, but for ease of understanding to users, we will classify it with pre-processing attributes
	message?: string | void | ((params: Params) => string | void) | ((params: Params) => Promise<string | void>);
	options?: Array<string> | ((params: Params) => Array<string>) | ((params: Params) => Promise<Array<string>>) |
		{items: Array<string>, sendOutput?: boolean, reusable?: boolean} |
		((params: Params) => {items: Array<string>, sendOutput?: boolean, reusable?: boolean}) |
		((params: Params) => Promise<{items: Array<string>, sendOutput?: boolean, reusable?: boolean}>);
	checkboxes?: Array<string> | ((params: Params) => Array<string>) |
		((params: Params) => Promise<Array<string>>) |
		{items: Array<string>, max?: number, min?: number, sendOutput?: boolean, reusable?: boolean} |
		((params: Params) => {items: Array<string>, max?: number, min?: number, sendOutput?: boolean, reusable?: boolean}) |
		((params: Params) => Promise<{items: Array<string>, max?: number, min?: number, sendOutput?: boolean, reusable?: boolean}>);
	component?: JSX.Element | void | ((params: Params) => JSX.Element | void) |
	((params: Params) => Promise<JSX.Element | void>);
	chatDisabled?: boolean | ((params: Params) => boolean) | ((params: Params) => Promise<boolean>);
	isSensitive?: boolean | ((params: Params) => boolean) | ((params: Params) => Promise<boolean>);
	transition?: number | {duration: number, interruptable?: boolean} | void | 
		((params: Params) =>  number | {duration: number, interruptable?: boolean} | void) |
		((params: Params) => Promise<number | {duration: number, interruptable?: boolean} | void>);

	// post-processing attributes (runs after user input)
	function?: ((params: Params) => void) | ((params: Params) => Promise<void>);
	file?: ((params: Params) => void) | ((params: Params) => Promise<void>);
	path?: string | null | undefined | ((params: Params) => string | null | undefined) |
	((params: Params) => Promise<string | null | undefined>);
}