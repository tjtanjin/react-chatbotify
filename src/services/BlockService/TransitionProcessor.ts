import { MutableRefObject } from "react";

import { Params } from "../../types/Params";
import { Block } from "../../types/Block";
import { postProcessBlock } from "./BlockService";

/**
 * Handles processing of transition in current block.
 *
 * @param block current block to transition for
 * @param params contains parameters that can be used/passed into attributes
 * @param timeoutIdRef ref to the timeout id for transition attribute
 * @param firePostProcessBlockEvent handles post processing block for transition attribute
 */
export const processTransition = async (block: Block, params: Params,
	timeoutIdRef: MutableRefObject<ReturnType<typeof setTimeout> | null>,
	firePostProcessBlockEvent: (block: Block) => Promise<Block | null>) => {

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
		// fire event and use final block (if applicable)
		// finalBlock is used because it's possible users update the block in the event
		const finalBlock = await firePostProcessBlockEvent(block);
		if (finalBlock) {
			await postProcessBlock(finalBlock, params);
		}
	}, transitionDetails.duration);
	if (transitionDetails.interruptable) {
		timeoutIdRef.current = timeoutId;
	}
}