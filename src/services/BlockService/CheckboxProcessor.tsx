import UserCheckBoxes from "../../components/UserCheckBoxes/UserCheckBoxes";
import { Block } from "../../types/Block";

/**
 * Handles processing of checkboxes in current block.
 * 
 * @param block current block being processed
 * @param path path associated with the current block
 * @param injectMessage utility function for injecting a message into the messages array
 * @param handleActionInput handles action input from user 
 */
export const processCheckboxes = (block: Block, path: string,
	injectMessage: (content: string | JSX.Element, isUser?: boolean) => void,
	handleActionInput: (path: string, userInput: string, sendUserInput: boolean) => void) => {

	const checkBoxes = block.checkBoxes;
	if (checkBoxes == null) {
		return;
	}

	// nothing to render if no items present
	if (checkBoxes.items.length == 0) {
		return;
	}

	// defaults min value to 1 if not provided
	if (checkBoxes.min == null) {
		checkBoxes.min = 1;
	}

	// defaults max value to length of items if not provided
	if (checkBoxes.max == null) {
		checkBoxes.max = checkBoxes.items.length;
	}
	
	// enforces minimum cannot be greater than maximum
	if (checkBoxes.min > checkBoxes.max) {
		checkBoxes.min = checkBoxes.max;
	}

	const checkedItems = new Set<string>();

	const content = (
		<UserCheckBoxes checkBoxes={checkBoxes} checkedItems={checkedItems} path={path}
			handleActionInput={handleActionInput}
		/>
	);
	injectMessage(content);
}