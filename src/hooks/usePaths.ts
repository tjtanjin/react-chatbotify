import { usePathsInternal } from "./internal/usePathsInternal";

/**
 * External custom hook for managing paths in the chatbot conversation flow.
 */
export const usePaths = () => {
	// handles paths
	const {
		getCurrPath,
		getPrevPath,
		goToPath,
		paths,
		replacePaths,
	} = usePathsInternal();

	return {
		getCurrPath,
		getPrevPath,
		goToPath,
		paths,
		replacePaths,
	};
};
