import UserOptions from "../../components/ChatBotBody/UserOptions/UserOptions";
import { Block } from "../../types/Block";
import { Params } from "../../types/Params";
import { Flow } from "../../types/Flow";

/**
 * Handles processing of options in current block.
 * 
 * @param block current block being processed
 * @param path path associated with the current block
 * @param handleActionInput handles action input from user
 * @param params contains parameters that can be used/passed into attributes
 */
export const processOptions = async (block: Block, path: keyof Flow,
	handleActionInput: (path: keyof Flow, userInput: string, sendUserInput: boolean) => Promise<void>,
	params: Params) => {

	const options = block.options;
	if (!options) {
		return;
	}

	let parsedOptions;
	if (typeof options === "function") {
		parsedOptions = options(params);
		if (parsedOptions instanceof Promise) {
			parsedOptions = await parsedOptions;
		}
	} else if (Array.isArray(options)) {
		parsedOptions = {items: options};
	} else {
		parsedOptions = options;
	}

	// nothing to render if no items present
	if (!("items" in parsedOptions)) {
		return;
	}
	if (parsedOptions.items.length == 0) {
		return;
	}

	// defaults to not reusable if not provided
	if (parsedOptions.reusable == null) {
		parsedOptions.reusable = false;
	}

	// note that sendOutput has no default here, as it fallback to the global
	// settings.chatInput.sendOptionOutput inside user options component if not specified

	const content = <UserOptions options={parsedOptions} path={path} handleActionInput={handleActionInput} />
	params.injectMessage(content);
}
