import { Block } from "../../types/Block";
import { Params } from "../../types/Params";

/**
 * Handles processing of chat disabled in current block.
 * 
 * @param block current block being processed
 * @param params contains parameters that can be used/passed into attributes
 * @param setSyncedTextAreaDisabled sets the state of the textarea for user input
 */
export const processChatDisabled = async (block: Block, params: Params,
	setSyncedTextAreaDisabled: (inputDisabled: boolean) => void) => {

	const chatDisabled = block.chatDisabled;
	if (chatDisabled == null) {
		return;
	}

	let parsedChatDisabled;
	if (typeof chatDisabled === "function") {
		parsedChatDisabled = chatDisabled(params);
		if (parsedChatDisabled instanceof Promise) {
			parsedChatDisabled = await parsedChatDisabled;
		}
	} else {
		parsedChatDisabled = chatDisabled;
	}

	setSyncedTextAreaDisabled(parsedChatDisabled);
}
