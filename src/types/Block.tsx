import { Params } from "./Params";

/**
 * Defines the attributes allowed within a conversation block.
 */
export type Block = {
	// pre-processing attributes (runs on block entry)
	message?: string | void | ((params: Params) => string | void) | ((params: Params) => Promise<string | void>);
	options?: Array<string>;
	checkboxes?: {items: Array<string>, max?: number, min?: number};
	render?: JSX.Element | void | ((params: Params) => JSX.Element | void) |
	((params: Params) => Promise<JSX.Element | void>);
	chatDisabled?: boolean;
	transition?: {duration: number, interruptable?: boolean} | void | 
	((params: Params) => {duration: number, interruptable?: boolean} | void) |
	((params: Params) => Promise<{duration: number, interruptable?: boolean} | void>);

	// post-processing attributes (runs after user input)
	function?: ((params: Params) => void) | ((params: Params) => Promise<void>);
	file?: ((params: Params) => void) | ((params: Params) => Promise<void>);
	path?: string | null | undefined | ((params: Params) => string | null | undefined) |
	((params: Params) => Promise<string | null | undefined>);
}