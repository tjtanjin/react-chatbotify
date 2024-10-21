import { useStylesInternal } from "./internal/useStylesInternal";

/**
 * External custom hook for managing styles.
 */
export const useStyles = () => {
	// handles styles
	const { styles, replaceStyles, updateStyles } = useStylesInternal();

	return {
		styles,
		replaceStyles,
		updateStyles
	};
};
