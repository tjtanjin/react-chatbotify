import { Block } from "../../types/Block";
import { Params } from "../../types/Params";

/**
 * Handles processing of path in current block.
 * 
 * @param block current block being processed
 * @param params contains parameters that can be used/passed into attributes
 */
export const processPath = async (block: Block, params: Params) => {
	const nextPath = block.path;
	if (!nextPath) {
		return false;
	}

	if (typeof nextPath === "string") {
		await params.goToPath(nextPath);
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
	await params.goToPath(path);
	return true;
}