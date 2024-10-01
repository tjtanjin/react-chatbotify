import { useContext, createContext, Dispatch, SetStateAction, useState } from "react";

import { Flow } from "../types/Flow";

/**
 * Creates the usePathsContext() context hook to manage user paths.
 */
type PathsContextType = {
	paths: (keyof Flow)[];
	setPaths: Dispatch<SetStateAction<string[]>>;
};
const PathsContext = createContext<PathsContextType>({paths: [], setPaths: () => null});
const usePathsContext = () => useContext(PathsContext);

/**
 * Creates provider to wrap the chatbot container.
 */
const PathsProvider = ({ children }: { children: React.ReactNode }) => {
	// handles paths of the user
	const [paths, setPaths] = useState<string[]>([]);

	return (
		<PathsContext.Provider value={{ paths, setPaths }}>
			{children}
		</PathsContext.Provider>
	);
};

export { usePathsContext, PathsProvider };
