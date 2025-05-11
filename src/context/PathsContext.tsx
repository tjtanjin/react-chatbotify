import { useContext, createContext, Dispatch, SetStateAction, MutableRefObject } from "react";

import { Flow } from "../types/Flow";
import { useSyncedRefState } from "../hooks/internal/useSyncedRefState";

/**
 * Creates the usePathsContext() context hook to manage user paths.
 */
type PathsContextType = {
	paths: (keyof Flow)[];
	setSyncedPaths: Dispatch<SetStateAction<string[]>>;
	syncedPathsRef: MutableRefObject<string[]>;
};
const PathsContext = createContext<PathsContextType>({
	paths: [],
	setSyncedPaths: () => {},
	syncedPathsRef: {current: []}
});
const usePathsContext = () => useContext(PathsContext);

/**
 * Creates provider to wrap the chatbot container.
 */
const PathsProvider = ({ children }: { children: React.ReactNode }) => {
	// handles paths of the user
	const [paths, setSyncedPaths, syncedPathsRef] = useSyncedRefState<string[]>([]);

	return (
		<PathsContext.Provider value={{ paths, setSyncedPaths, syncedPathsRef }}>
			{children}
		</PathsContext.Provider>
	);
};

export { usePathsContext, PathsProvider };
