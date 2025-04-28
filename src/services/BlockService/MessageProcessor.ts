import { Block } from "../../types/Block";
import { Params } from "../../types/Params";

/**
 * Handles processing of message in current block.
 * 
 * @param block current block being processed
 * @param params contains parameters that can be used/passed into attributes
 * @param botSimulateStreamEnabled boolean indicating whether to simulate stream message for bot
 */
export const processMessage = async (block: Block, params: Params, botSimulateStreamEnabled: boolean) => {

	const replyMessage = block.message;
	if (!replyMessage) {
		return;
	}
	
	if (typeof replyMessage === "string") {
		if (replyMessage.trim() !== "") {
			if (botSimulateStreamEnabled) {
				await params.simulateStreamMessage(replyMessage);
			} else {
				await params.injectMessage(replyMessage);
			}
		}
		return;
	}

	let parsedMessage = replyMessage(params);
	if (parsedMessage instanceof Promise) {
		parsedMessage = await parsedMessage;
	}

	if (typeof parsedMessage !== "string") {
		return;
	}

	if (parsedMessage.trim() !== "") {
		if (botSimulateStreamEnabled) {
			await params.simulateStreamMessage(parsedMessage);
		} else {
			await params.injectMessage(parsedMessage);
		}
	}
}