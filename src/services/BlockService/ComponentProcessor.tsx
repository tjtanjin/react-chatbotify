import { Block } from "../../types/Block";
import { AttributeParams } from "../../types/AttributeParams";

/**
 * Handles processing of component in current block.
 * 
 * @param block current block being processed
 * @param params contains parameters that can be used/passed into attributes
 */
export const processComponent = async (block: Block, params: AttributeParams) => {

	const element = block.component;
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