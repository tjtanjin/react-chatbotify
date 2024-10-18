import { useStylesInternal } from "./internal/useStylesInternal";

/**
 * External custom hook for managing styles.
 */
export const useStyles = () => {
	// handles styles
	const { styles, setStyles, updateStyles } = useStylesInternal();

	return {
		styles,
		setStyles,
		updateStyles
	};
};
