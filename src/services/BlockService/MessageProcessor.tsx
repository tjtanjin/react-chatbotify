import { Block } from "../../types/Block";
import { BlockParams } from "../../types/BlockParams";

/**
 * Handles processing of message in current block.
 * 
 * @param block current block being processed
 * @param params contains userInput, prevPath and injectMessage that can be used/passed into attributes
 */
export const processMessage = async (block: Block, params: BlockParams) => {

	const replyMessage = block.message;
	if (!replyMessage) {
		return;
	}
	
	if (typeof replyMessage === "string") {
		if (replyMessage.trim() !== "") {
			await params.injectMessage(replyMessage);
		}
		return;
	}

	let parsedMessage = replyMessage(params);
	if (parsedMessage instanceof Promise) {
		parsedMessage = await parsedMessage;
	}

	if (!parsedMessage) {
		return;
	}

	if (parsedMessage.trim() !== "") {
		await params.injectMessage(parsedMessage);
	}
}