import { Params } from "./Params";

/**
 * Defines the attributes allowed within a conversation block.
 */
export type Block = {
	// pre-processing attributes (runs on block entry)
	message?: string | void | ((params: Params) => string | void);
	options?: Array<string>;
	checkBoxes?: {items: Array<string>, max?: number, min?: number};
	render?: JSX.Element | void | ((params: Params) => JSX.Element | void);
	chatDisabled?: boolean;
	transition?: number;
	timeout?: number;

	// post-processing attributes (runs after user input)
	function?: ((params: Params) => void);
	file?: ((params: Params) => void);
	path?: string | null | undefined | ((params: Params) => string | null | undefined);
}