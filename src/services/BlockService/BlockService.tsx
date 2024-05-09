import { Dispatch, SetStateAction } from "react";

import { Flow } from "../../types/Flow";
import { processCheckboxes } from "./CheckboxProcessor";
import { processFunction } from "./FunctionProcessor";
import { processMessage } from "./MessageProcessor";
import { processOptions } from "./OptionProcessor";
import { processPath } from "./PathProcessor";
import { processRender } from "./RenderProcessor";
import { processTransition } from "./TransitionProcessor";
import { Params } from "../../types/Params";
import { Block } from "../../types/Block";

/**
 * Handles the preprocessing within a block.
 * 
 * @param flow conversation flow for the bot
 * @param path path associated with the current block
 * @param params contains userInput, prevPath and injectMessage that can be used/passed into attributes
 * @param setTextAreaDisabled sets the state of the textarea for user input
 * @param setTextAreaSensitiveMode sets the sensitive mode of the textarea for user input
 * @param setPaths updates the paths taken by the user
 * @param setTimeoutId sets the timeout id for the transition attribute if it is interruptable
 * @param handleActionInput handles action input from user 
 */
export const preProcessBlock = async (flow: Flow, path: keyof Flow, params: Params,
	setTextAreaDisabled: (inputDisabled: boolean) => void, setTextAreaSensitiveMode: (inputDisabled: boolean) => void,
	setPaths: Dispatch<SetStateAction<string[]>>, setTimeoutId: (timeoutId: ReturnType<typeof setTimeout>) => void, 
	handleActionInput: (path: keyof Flow, userInput: string, sendUserInput: boolean) => Promise<void>) => {

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
			processOptions(block, path, params.injectMessage, handleActionInput);
			break;
		
		case "checkboxes":
			processCheckboxes(block, path, params.injectMessage, handleActionInput);
			break;
		
		case "render":
			await processRender(block, params);
			break;
		
		case "chatDisabled":
			if (block.chatDisabled) {
				setTextAreaDisabled(block.chatDisabled);
			}
			break;

		case "isSensitive":
			if (block.isSensitive) {
				setTextAreaSensitiveMode(block.isSensitive);
			}
			break;

		case "transition":
			await processTransition(flow, path, params, setPaths, setTimeoutId);
		}
	}
}

/**
 * Handles the postprocessing within a block.
 * 
 * @param flow conversation flow for the bot
 * @param path path associated with the current block
 * @param params contains utilities that can be used/passed into attributes
 * @param setPaths updates the paths taken by the user
 */
export const postProcessBlock = async (flow: Flow, path: keyof Flow, params: Params,
	setPaths: Dispatch<SetStateAction<string[]>>) => {

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
		return await processPath(block, params, setPaths);
	}
	return false;
}