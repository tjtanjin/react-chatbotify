

import UserOptions from "../../components/UserOptions/UserOptions";
import { Block } from "../../types/Block";

/**
 * Handles processing of options in current block.
 * 
 * @param block current block being processed
 * @param path path associated with the current block
 * @param injectMessage utility function for injecting a message into the messages array
 * @param handleActionInput handles action input from user 
 */
export const processOptions = (block: Block, path: string,
	injectMessage: (content: string | JSX.Element, isUser?: boolean) => void,
	handleActionInput: (path: string, userInput: string, sendUserInput: boolean) => void) => {

	const options = block.options;
	if (options == null) {
		return;
	}

	const content = <UserOptions options={options} path={path} handleActionInput={handleActionInput} />
	injectMessage(content);
}
