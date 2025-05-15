import { MutableRefObject } from "react";

import { processCheckboxes } from "./CheckboxProcessor";
import { processFunction } from "./FunctionProcessor";
import { processMessage } from "./MessageProcessor";
import { processOptions } from "./OptionProcessor";
import { processPath } from "./PathProcessor";
import { processComponent } from "./ComponentProcessor";
import { processTransition } from "./TransitionProcessor";
import { Params } from "../../types/Params";
import { Block } from "../../types/Block";
import { processChatDisabled } from "./ChatDisabledProcessor";
import { processIsSensitive } from "./IsSensitiveProcessor";

/**
 * Handles the preprocessing within a block.
 * 
 * @param block block to pre-process
 * @param params contains parameters that can be used/passed into attributes
 * @param botSimulateStreamEnabled indicates if bot simulating stream is enabled
 * @param timeoutIdRef ref to the timeout id for transition attribute
 * @param setSyncedTextAreaDisabled sets the state of the textarea for user input
 * @param setSyncedTextAreaSensitiveMode sets the sensitive mode of the textarea for user input
 * @param firePostProcessBlockEvent handles post processing block for transition attribute
 */
export const preProcessBlock = async (block: Block, params: Params, botSimulateStreamEnabled: boolean,
	timeoutIdRef: MutableRefObject<ReturnType<typeof setTimeout> | null>,
	setSyncedTextAreaDisabled: (inputDisabled: boolean) => void,
	setSyncedTextAreaSensitiveMode: (inputDisabled: boolean) => void,
	firePostProcessBlockEvent: (block: Block) => Promise<Block | null>) => {

	if (!block) {
		throw new Error("Block is not valid.");
	}

	for (const attribute of Object.keys(block)) {
		const attributeAsFlowKeyType = attribute as keyof Block;
		switch (attributeAsFlowKeyType) {
		case "message":
			await processMessage(block, params, botSimulateStreamEnabled);
			break;
		
		case "options":
			await processOptions(block, params);
			break;
		
		case "checkboxes":
			await processCheckboxes(block, params);
			break;
		
		case "component":
			await processComponent(block, params);
			break;
		
		case "chatDisabled":
			await processChatDisabled(block, params, setSyncedTextAreaDisabled);
			break;

		case "isSensitive":
			await processIsSensitive(block, params, setSyncedTextAreaSensitiveMode);
			break;

		case "transition":
			await processTransition(block, params, timeoutIdRef, firePostProcessBlockEvent);
		}
	}
}

/**
 * Handles the postprocessing within a block.
 * 
 * @param block block to post-process
 * @param params contains utilities that can be used/passed into attributes
 */
export const postProcessBlock = async (block: Block, params: Params) => {
	if (!block) {
		throw new Error("Block is not valid.");
	}

	const attributes = Object.keys(block) as (keyof Block)[];
	for (const attribute of attributes) {
		if (attribute === "function") {
			await processFunction(block, params);
		}
	}

	// path is always executed last in post-processing
	if (attributes.includes("path")) {
		await processPath(block, params);
	}
}
