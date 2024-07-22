import { useContext, createContext, Dispatch, SetStateAction } from "react";

import { Styles } from "../types/Styles";

/**
 * Creates the useStyles() hook to manage styles for the chatbot.
 */
type StylesContextType = {
	styles: Styles;
	setStyles: Dispatch<SetStateAction<Styles>>;
}
const StylesContext = createContext<StylesContextType>({styles: {}, setStyles: () => null});
const useStyles = () => useContext(StylesContext);

export {
	StylesContext,
	useStyles
};