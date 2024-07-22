import { Block } from "../../types/Block";
import { AttributeParams } from "../../types/AttributeParams";

/**
 * Handles processing of is sensitive in current block.
 * 
 * @param block current block being processed
 * @param setTextAreaSensitiveMode sets the sensitive mode of the textarea for user input
 * @param params contains parameters that can be used/passed into attributes
 */
export const processIsSensitive = async (block: Block, setTextAreaSensitiveMode: (inputDisabled: boolean) => void,
	params: AttributeParams) => {

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
