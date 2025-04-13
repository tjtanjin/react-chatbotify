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
import { Flow } from "../../types/Flow";

/**
 * Handles the preprocessing within a block.
 * 
 * @param flow conversation flow for the bot
 * @param params contains parameters that can be used/passed into attributes
 * @param setTextAreaDisabled sets the state of the textarea for user input
 * @param setTextAreaSensitiveMode sets the sensitive mode of the textarea for user input
 * @param setTimeoutId sets the timeout id for the transition attribute if it is interruptable
 */
export const preProcessBlock = async (flow: Flow, params: Params,
	setTextAreaDisabled: (inputDisabled: boolean) => void, setTextAreaSensitiveMode: (inputDisabled: boolean) => void,
	setTimeoutId: (timeoutId: ReturnType<typeof setTimeout>) => void) => {

	const path = params.currPath as string;
	const block = flow[path];

	if (!block) {
		throw new Error("Block is not valid.");
	}

	for (const attribute of Object.keys(block)) {
		const attributeAsFlowKeyType = attribute as keyof Block;
		switch (attributeAsFlowKeyType) {
		case "message":
			await processMessage(block, params);
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
			await processChatDisabled(block, params, setTextAreaDisabled);
			break;

		case "isSensitive":
			await processIsSensitive(block, params, setTextAreaSensitiveMode);
			break;

		case "transition":
			await processTransition(flow, params, setTimeoutId);
		}
	}
}

/**
 * Handles the postprocessing within a block.
 * 
 * @param flow conversation flow for the bot
 * @param params contains utilities that can be used/passed into attributes
 */
export const postProcessBlock = async (flow: Flow, params: Params) => {
	const path = params.currPath as string;
	const block = flow[path];

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
		return await processPath(block, params);
	}
	return false;
}
