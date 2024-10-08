import { Block } from "../../types/Block";
import { Params } from "../../types/Params";

/**
 * Handles processing of chat disabled in current block.
 * 
 * @param block current block being processed
 * @param setTextAreaDisabled sets the state of the textarea for user input
 * @param params contains parameters that can be used/passed into attributes
 */
export const processChatDisabled = async (block: Block, setTextAreaDisabled: (inputDisabled: boolean) => void,
	params: Params) => {

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

	setTextAreaDisabled(parsedChatDisabled);
}
