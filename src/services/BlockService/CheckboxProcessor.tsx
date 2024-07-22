import UserCheckboxes from "../../components/ChatBotBody/UserCheckboxes/UserCheckboxes";
import { Block } from "../../types/Block";
import { Params } from "../../types/Params";
import { Flow } from "../../types/Flow";

/**
 * Handles processing of checkboxes in current block.
 * 
 * @param block current block being processed
 * @param path path associated with the current block
 * @param handleActionInput handles action input from user
 * @param params contains parameters that can be used/passed into attributes
 */
export const processCheckboxes = async (block: Block, path: keyof Flow,
	handleActionInput: (path: keyof Flow, userInput: string, sendUserInput: boolean) => Promise<void>,
	params: Params) => {

	const checkboxes = block.checkboxes;
	if (!checkboxes) {
		return;
	}

	let parsedCheckboxes;
	if (typeof checkboxes === "function") {
		parsedCheckboxes = checkboxes(params);
		if (parsedCheckboxes instanceof Promise) {
			parsedCheckboxes = await parsedCheckboxes;
		}
	} else {
		parsedCheckboxes = checkboxes;
	}

	// nothing to render if no items present
	if (parsedCheckboxes.items.length == 0) {
		return;
	}

	// defaults min value to 1 if not provided
	if (parsedCheckboxes.min == null) {
		parsedCheckboxes.min = 1;
	}

	// defaults max value to length of items if not provided
	if (parsedCheckboxes.max == null) {
		parsedCheckboxes.max = parsedCheckboxes.items.length;
	}
	
	// enforces minimum cannot be greater than maximum
	if (parsedCheckboxes.min > parsedCheckboxes.max) {
		parsedCheckboxes.min = parsedCheckboxes.max;
	}

	const checkedItems = new Set<string>();

	const content = (
		<UserCheckboxes checkboxes={parsedCheckboxes} checkedItems={checkedItems} path={path}
			handleActionInput={handleActionInput}
		/>
	);
	params.injectMessage(content);
}