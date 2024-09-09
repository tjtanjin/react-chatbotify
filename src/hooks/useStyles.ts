import { useStylesContext } from "../context/StylesContext";

/**
 * External custom hook for managing styles.
 */
export const useStyles = () => {
	// handles styles
	const { styles, setStyles } = useStylesContext();

	return {
		styles,
		setStyles
	};
};
