import { useBotIdInternal } from "./internal/useBotIdInternal";

/**
 * External custom hook for managing bot id.
 */
export const useBotId = () => {
	// handles bot id
	const { getBotId } = useBotIdInternal();
	
	return {
		getBotId
	};
}