import { Block } from "../../types/Block";
import { Params } from "../../types/Params";

/**
 * Handles processing of function in current block.
 * 
 * @param block current block being processed
 * @param params contains parameters that can be used/passed into attributes
 */
export const processFunction = async (block: Block, params: Params) => {
	const func = block.function;
	if (!func) {
		return;
	}

	const result = func(params);
	if (result instanceof Promise) {
		return await result;
	}
	return result;
}