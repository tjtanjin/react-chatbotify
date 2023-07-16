import { Block } from "../../types/Block";
import { Params } from "../../types/Params";

/**
 * Handles processing of function in current block.
 * 
 * @param block current block being processed
 * @param params contains userInput, prevPath and injectMessage that can be used/passed into attributes
 */
export const processFunction = (block: Block, params: Params) => {

	const func = block.function;
	if (func == null) {
		return;
	}
	func(params);
}