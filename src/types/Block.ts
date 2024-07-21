import { BlockParams } from "./BlockParams";

/**
 * Defines the attributes allowed within a conversation block.
 */
export type Block = {
	// pre-processing attributes (runs on block entry)
	// for developers of this library - the "isSensitive" attribute is technically processed only when user sends an
	// input, but for ease of understanding to users, we will classify it with pre-processing attributes
	message?: string | void | ((params: BlockParams) => string | void) | ((params: BlockParams) => Promise<string | void>);
	options?: Array<string> | ((params: BlockParams) => Array<string>) | ((params: BlockParams) => Promise<Array<string>>);
	checkboxes?: {items: Array<string>, max?: number, min?: number} |
		((params: BlockParams) => {items: Array<string>, max?: number, min?: number}) |
		((params: BlockParams) => Promise<{items: Array<string>, max?: number, min?: number}>);
	render?: JSX.Element | void | ((params: BlockParams) => JSX.Element | void) |
	((params: BlockParams) => Promise<JSX.Element | void>);
	chatDisabled?: boolean | ((params: BlockParams) => boolean) | ((params: BlockParams) => Promise<boolean>);
	isSensitive?: boolean | ((params: BlockParams) => boolean) | ((params: BlockParams) => Promise<boolean>);
	transition?: {duration: number, interruptable?: boolean} | void | 
		((params: BlockParams) => {duration: number, interruptable?: boolean} | void) |
		((params: BlockParams) => Promise<{duration: number, interruptable?: boolean} | void>);

	// post-processing attributes (runs after user input)
	function?: ((params: BlockParams) => void) | ((params: BlockParams) => Promise<void>);
	file?: ((params: BlockParams) => void) | ((params: BlockParams) => Promise<void>);
	path?: string | null | undefined | ((params: BlockParams) => string | null | undefined) |
	((params: BlockParams) => Promise<string | null | undefined>);
}