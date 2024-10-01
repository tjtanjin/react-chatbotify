import { useFlowInternal } from "./internal/useFlowInternal";

/**
 * External custom hook for managing flow.
 */
export const useFlow = () => {
	// handles flows
	const { hasFlowStarted, restartFlow, getFlow } = useFlowInternal();
	
	return {
		hasFlowStarted,
		restartFlow,
		getFlow
	};
}