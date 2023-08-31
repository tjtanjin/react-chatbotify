import { Block } from "../../types/Block";
import { Params } from "../../types/Params";

/**
 * Handles processing of message in current block.
 * 
 * @param block current block being processed
 * @param params contains userInput, prevPath and injectMessage that can be used/passed into attributes
 */
export const processMessage = async (block: Block, params: Params) => {

	const replyMessage = block.message;
	if (replyMessage == null) {
		return;
	}
	
	if (typeof replyMessage === "string") {
		if (replyMessage.trim() !== "") {
			params.injectMessage(replyMessage);
		}
		return;
	}

	let parsedMessage = replyMessage(params);
	if (parsedMessage instanceof Promise) {
		parsedMessage = await parsedMessage;
	}

	if (parsedMessage == null) {
		return;
	}

	if (parsedMessage.trim() !== "") {
		params.injectMessage(parsedMessage);
	}
}