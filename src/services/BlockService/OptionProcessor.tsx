import UserOptions from "../../components/ChatBotBody/UserOptions/UserOptions";
import { Block } from "../../types/Block";
import { BlockParams } from "../../types/BlockParams";
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
	params: BlockParams) => {

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


	const content = <UserOptions options={parsedOptions} path={path} handleActionInput={handleActionInput} />
	params.injectMessage(content);
}
