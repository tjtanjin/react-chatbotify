import { postProcessBlock} from "./BlockService";
import { Flow } from "../../types/Flow";
import { Params } from "../../types/Params";

/**
 * Handles processing of transition in current block.
 *
 * @param flow conversation flow for the bot
 * @param params contains parameters that can be used/passed into attributes
 * @param setTimeoutId sets the timeout id for the transition attribute if it is interruptable
 */
export const processTransition = async (flow: Flow, params: Params,
	setTimeoutId: (timeoutId: ReturnType<typeof setTimeout>) => void) => {

	const path = params.currPath as string;
	const block = flow[path];

	if (!block) {
		throw new Error("block is not valid.");
	}

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

	// if number provided, transform to object with default values
	if (typeof transitionDetails === "number") {
		transitionDetails = {duration: transitionDetails};
	}

	// cannot transition if details are not present
	if (!transitionDetails || transitionDetails instanceof Promise) {
		return;
	}

	// cannot transition if duration is invalid
	if (transitionDetails.duration == null || typeof transitionDetails.duration !== "number") {
		return;
	}

	// defaults interruptable to false if not found
	if (transitionDetails.interruptable == null) {
		transitionDetails.interruptable = false;
	}
	
	const timeoutId = setTimeout(async () => {
		await postProcessBlock(flow, params);
	}, transitionDetails.duration);
	if (transitionDetails.interruptable) {
		setTimeoutId(timeoutId);
	}
}