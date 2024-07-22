import { Dispatch, SetStateAction } from "react";

import { Block } from "../../types/Block";
import { AttributeParams } from "../../types/AttributeParams";

/**
 * Handles processing of path in current block.
 * 
 * @param block current block being processed
 * @param params contains parameters that can be used/passed into attributes
 * @param setPaths updates the paths taken by the user
 */
export const processPath = async (block: Block, params: AttributeParams,
	setPaths: Dispatch<SetStateAction<string[]>>) => {

	const nextPath = block.path;
	if (!nextPath) {
		return false;
	}

	if (typeof nextPath === "string") {
		setPaths(prev => [...prev, nextPath]);
		return true;
	}

	let parsedPath = nextPath(params);
	if (parsedPath instanceof Promise) {
		parsedPath = await parsedPath;
	}

	if (!parsedPath) {
		return false;
	}
	const path = parsedPath;
	setPaths(prev => [...prev, path]);
	return true;
}