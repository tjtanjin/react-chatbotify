import { Dispatch, SetStateAction } from "react";

import { postProcessBlock} from "./BlockService";
import { Flow } from "../../types/Flow";
import { Params } from "../../types/Params";

/**
 * Handles processing of transition in current block.
 * 
 * @param flow conversation flow for the bot
 * @param path path associated with the current block
 * @param params contains userInput, prevPath and injectMessage that can be used/passed into attributes
 * @param setPaths updates the paths taken by the user
 * @param setTimeoutId sets the timeout id for the transition attribute if it is interruptable
 */
export const processTransition = (flow: Flow, path: string, params: Params,
	setPaths: Dispatch<SetStateAction<string[]>>,
	setTimeoutId: (timeoutId: ReturnType<typeof setTimeout>) => void) => {

	const block = flow[path];
	let transitionDetails = block.transition;

	if (typeof transitionDetails === "function") {
		transitionDetails = transitionDetails(params);
	}

	// cannot transition if details are not present
	if (transitionDetails == null) {
		return;
	}

	// cannot transition if duration is invalid
	if (transitionDetails.duration == null || typeof transitionDetails.duration != "number") {
		return;
	}

	// defaults interruptable to false if not found
	if (transitionDetails.interruptable == null) {
		transitionDetails.interruptable = false;
	}
	
	const timeoutId = setTimeout(() => {
		postProcessBlock(flow, path, params, setPaths);
	}, transitionDetails.duration);
	if (transitionDetails.interruptable) {
		setTimeoutId(timeoutId);
	}
}