import { Block } from "../../types/Block";
import { Params } from "../../types/Params";

/**
 * Handles processing of is sensitive in current block.
 * 
 * @param block current block being processed
 * @param setTextAreaSensitiveMode sets the sensitive mode of the textarea for user input
 * @param params contains parameters that can be used/passed into attributes
 */
export const processIsSensitive = async (block: Block, setTextAreaSensitiveMode: (inputDisabled: boolean) => void,
	params: Params) => {

	const isSensitive = block.isSensitive;
	if (!isSensitive) {
		setTextAreaSensitiveMode(false);
		return;
	}

	let parsedIsSensitive;
	if (typeof isSensitive === "function") {
		parsedIsSensitive = isSensitive(params);
		if (parsedIsSensitive instanceof Promise) {
			parsedIsSensitive = await parsedIsSensitive;
		}
	} else {
		parsedIsSensitive = isSensitive;
	}

	setTextAreaSensitiveMode(parsedIsSensitive);
}
