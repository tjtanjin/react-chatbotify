import { Dispatch, SetStateAction } from "react";

import { postProcessBlock} from "./BlockService";
import { Flow } from "../../types/Flow";
import { Params } from "../../types/Params";

/**
 * Handles processing of timeout in current block.
 * 
 * @param flow conversation flow for the bot
 * @param path path associated with the current block
 * @param params contains userInput, prevPath and injectMessage that can be used/passed into attributes
 * @param setPaths updates the paths taken by the user
 * @param setTimeoutId sets the timeout id for the timeout attribute
 */
export const processTimeout = (flow: Flow, path: string, params: Params,
	setPaths: Dispatch<SetStateAction<string[]>>,
	setTimeoutId: (timeoutId: ReturnType<typeof setTimeout>) => void) => {

	const block = flow[path];
	if (block.transition == null) {
		return;
	}
	
	const timeoutId = setTimeout(() => {
		postProcessBlock(flow, path, params, setPaths);
	}, block.transition);
	setTimeoutId(timeoutId);
}