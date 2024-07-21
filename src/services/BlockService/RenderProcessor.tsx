import { Block } from "../../types/Block";
import { BlockParams } from "../../types/BlockParams";

/**
 * Handles processing of render in current block.
 * 
 * @param block current block being processed
 * @param params contains parameters that can be used/passed into attributes
 */
export const processRender = async (block: Block, params: BlockParams) => {

	const element = block.render;
	if (!element) {
		return;
	}

	if (typeof element === "function") {
		let content = element(params);
		if (content instanceof Promise) {
			content = await content;
		}

		if (!content) {
			return;
		}
		await params.injectMessage(content);
		return;
	}

	await params.injectMessage(element);
}