import { useCallback } from "react";

import { deepClone, getCombinedConfig } from "../../utils/configParser";
import { useStylesContext } from "../../context/StylesContext";
import { Styles } from "../../types/Styles";

/**
 * Internal custom hook for managing styles.
 */
export const useStylesInternal = () => {
	// handles styles
	const { styles, setStyles } = useStylesContext();

	/**
	 * Updates the styles for the chatbot.
	 *
	 * @param fields fields to update
	 */
	const updateStyles = useCallback((fields: Styles) => {
		if (!fields || Object.keys(fields).length === 0) {
			return;
		}
		setStyles(deepClone(getCombinedConfig(fields, styles) as Styles));
	}, [styles])

	/**
	 * Replaces (overwrites entirely) the current styles with the new styles.
	 */
	const replaceStyles = useCallback((newStyles: Styles) => {
		setStyles(newStyles);
	}, [])

	return {
		styles,
		replaceStyles,
		updateStyles
	};
};
