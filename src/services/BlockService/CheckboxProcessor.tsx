import UserCheckboxes from "../../components/ChatBotBody/UserCheckboxes/UserCheckboxes";
import { Block } from "../../types/Block";
import { Flow } from "../../types/Flow";
import { Params } from "../../types/Params";

/**
 * Handles processing of checkboxes in current block.
 *
 * @param flow conversation flow for the bot
 * @param block current block being processed
 * @param path path associated with the current block
 * @param params contains parameters that can be used/passed into attributes
 */
export const processCheckboxes = async (flow: Flow, block: Block, path: keyof Flow, params: Params) => {

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

	// if array provided, transform to object with default values
	if (Array.isArray(parsedCheckboxes)) {
		parsedCheckboxes = {items: parsedCheckboxes};
	}

	// nothing to render if no items present
	if (!("items" in parsedCheckboxes)) {
		return;
	}
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

	// defaults to not reusable if not provided
	if (parsedCheckboxes.reusable == null) {
		parsedCheckboxes.reusable = false;
	}

	// note that sendOutput has no default here, as it fallback to the global
	// settings.chatInput.sendCheckboxOutput inside user checkboxes component if not specified

	const checkedItems = new Set<string>();

	const content = (
		<UserCheckboxes checkboxes={parsedCheckboxes} checkedItems={checkedItems} path={path} />
	);
	await params.injectMessage(content);
}
