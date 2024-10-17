import { getCombinedConfig } from "../../utils/configParser";
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
    const updateStyles = (fields: object) => {
        setStyles(getCombinedConfig(fields, styles) as Styles);
    }

	return {
		styles,
		setStyles,
        updateStyles
	};
};
