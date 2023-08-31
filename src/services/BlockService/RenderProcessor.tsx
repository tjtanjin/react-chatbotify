import { Block } from "../../types/Block";
import { Params } from "../../types/Params";

/**
 * Handles processing of render in current block.
 * 
 * @param block current block being processed
 * @param params contains userInput, prevPath and injectMessage that can be used/passed into attributes
 */
export const processRender = async (block: Block, params: Params) => {

	const element = block.render;
	if (element == null) {
		return;
	}

	if (typeof element === "function") {
		let content = element(params);
		if (content instanceof Promise) {
			content = await content;
		}

		if (content == null) {
			return;
		}
		params.injectMessage(content);
		return;
	}

	params.injectMessage(element);
}