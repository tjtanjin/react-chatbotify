import { Dispatch, SetStateAction } from "react";

import { Block } from "../../types/Block";
import { Params } from "../../types/Params";

/**
 * Handles processing of path in current block.
 * 
 * @param block current block being processed
 * @param params contains userInput, prevPath and injectMessage that can be used/passed into attributes
 * @param setPaths updates the paths taken by the user
 */
export const processPath = async (block: Block, params: Params,
	setPaths: Dispatch<SetStateAction<string[]>>) => {

	const nextPath = block.path;
	if (nextPath == null) {
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

	if (parsedPath == null) {
		return false;
	}
	// eslint-disable-next-line
	// @ts-ignore
	setPaths(prev => [...prev, parsedPath]);
	return true;
}