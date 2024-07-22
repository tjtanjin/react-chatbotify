import { AttributeParams } from "./AttributeParams";

/**
 * Defines the attributes allowed within a conversation block.
 */
export type Block = {
	// pre-processing attributes (runs on block entry)
	// for developers of this library - the "isSensitive" attribute is technically processed only when user sends an
	// input, but for ease of understanding to users, we will classify it with pre-processing attributes
	message?: string | void | ((params: AttributeParams) => string | void) | ((params: AttributeParams) => Promise<string | void>);
	options?: Array<string> | ((params: AttributeParams) => Array<string>) | ((params: AttributeParams) => Promise<Array<string>>);
	checkboxes?: {items: Array<string>, max?: number, min?: number} |
		((params: AttributeParams) => {items: Array<string>, max?: number, min?: number}) |
		((params: AttributeParams) => Promise<{items: Array<string>, max?: number, min?: number}>);
	component?: JSX.Element | void | ((params: AttributeParams) => JSX.Element | void) |
	((params: AttributeParams) => Promise<JSX.Element | void>);
	chatDisabled?: boolean | ((params: AttributeParams) => boolean) | ((params: AttributeParams) => Promise<boolean>);
	isSensitive?: boolean | ((params: AttributeParams) => boolean) | ((params: AttributeParams) => Promise<boolean>);
	transition?: {duration: number, interruptable?: boolean} | void | 
		((params: AttributeParams) => {duration: number, interruptable?: boolean} | void) |
		((params: AttributeParams) => Promise<{duration: number, interruptable?: boolean} | void>);

	// post-processing attributes (runs after user input)
	function?: ((params: AttributeParams) => void) | ((params: AttributeParams) => Promise<void>);
	file?: ((params: AttributeParams) => void) | ((params: AttributeParams) => Promise<void>);
	path?: string | null | undefined | ((params: AttributeParams) => string | null | undefined) |
	((params: AttributeParams) => Promise<string | null | undefined>);
}