import UserCheckboxes from "../../components/ChatBotBody/UserCheckboxes/UserCheckboxes";
import { Block } from "../../types/Block";
import { Flow } from "../../types/Flow";

/**
 * Handles processing of checkboxes in current block.
 * 
 * @param block current block being processed
 * @param path path associated with the current block
 * @param injectMessage utility function for injecting a message into the messages array
 * @param handleActionInput handles action input from user 
 */
export const processCheckboxes = (block: Block, path: keyof Flow,
	injectMessage: (content: string | JSX.Element, sender?: string) => void,
	handleActionInput: (path: keyof Flow, userInput: string, sendUserInput: boolean) => Promise<void>) => {

	const checkboxes = block.checkboxes;
	if (!checkboxes) {
		return;
	}

	// nothing to render if no items present
	if (checkboxes.items.length == 0) {
		return;
	}

	// defaults min value to 1 if not provided
	if (checkboxes.min == null) {
		checkboxes.min = 1;
	}

	// defaults max value to length of items if not provided
	if (checkboxes.max == null) {
		checkboxes.max = checkboxes.items.length;
	}
	
	// enforces minimum cannot be greater than maximum
	if (checkboxes.min > checkboxes.max) {
		checkboxes.min = checkboxes.max;
	}

	const checkedItems = new Set<string>();

	const content = (
		<UserCheckboxes checkboxes={checkboxes} checkedItems={checkedItems} path={path}
			handleActionInput={handleActionInput}
		/>
	);
	injectMessage(content);
}