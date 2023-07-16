import { useContext, createContext, Dispatch, SetStateAction } from "react";

/**
 * Creates the usePaths() context hook to manage user paths.
 */
type PathsContextType = {
	paths: string[]
	setPaths: Dispatch<SetStateAction<string[]>>;
}
const PathsContext = createContext<PathsContextType>({paths: [], setPaths: () => null});
const usePaths = () => useContext(PathsContext);

export {
	PathsContext,
	usePaths
};