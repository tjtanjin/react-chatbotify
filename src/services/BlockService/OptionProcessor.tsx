import UserOptions from "../../components/ChatBotBody/UserOptions/UserOptions";
import { Block } from "../../types/Block";
import { Params } from "../../types/Params";

/**
 * Handles processing of options in current block.
 *
 * @param block current block being processed
 * @param params contains parameters that can be used/passed into attributes
 */
export const processOptions = async (block: Block, params: Params) => {

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
	} else {
		parsedOptions = options;
	}

	// if array provided, transform to object with default values
	if (Array.isArray(parsedOptions)) {
		parsedOptions = {items: parsedOptions};
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
	const path = params.currPath as string;
	const content = <UserOptions options={parsedOptions} path={path} />
	await params.injectMessage(content);
}
