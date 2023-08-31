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
export const processTransition = async (flow: Flow, path: string, params: Params,
	setPaths: Dispatch<SetStateAction<string[]>>,
	setTimeoutId: (timeoutId: ReturnType<typeof setTimeout>) => void) => {

	const block = flow[path];
	const transitionAttr = block.transition;

	let transitionDetails;
	if (typeof transitionAttr === "function") {
		transitionDetails = transitionAttr(params);
		if (transitionDetails instanceof Promise) {
			transitionDetails = await transitionDetails;
		}
	} else {
		transitionDetails = transitionAttr;
	}

	// cannot transition if details are not present
	if (transitionDetails == null || transitionDetails instanceof Promise) {
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
	
	const timeoutId = setTimeout(async () => {
		await postProcessBlock(flow, path, params, setPaths);
	}, transitionDetails.duration);
	if (transitionDetails.interruptable) {
		setTimeoutId(timeoutId);
	}
}