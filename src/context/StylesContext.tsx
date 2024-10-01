import { useContext, createContext, Dispatch, SetStateAction } from "react";

import { Styles } from "../types/Styles";
import { DefaultStyles } from "../constants/internal/DefaultStyles";

/**
 * Creates the useStylesContext() hook to manage styles for the chatbot.
 */
type StylesContextType = {
	styles: Styles;
	setStyles: Dispatch<SetStateAction<Styles>>;
};
const StylesContext = createContext<StylesContextType>({styles: {}, setStyles: () => null});
const useStylesContext = () => useContext(StylesContext);

/**
 * Creates provider to wrap the chatbot container.
 */
const StylesProvider = ({
	children,
	styles = DefaultStyles,
	setStyles
}: {
	children: React.ReactNode;
	styles: Styles;
	setStyles: Dispatch<SetStateAction<Styles>>;
}) => {
	return (
		<StylesContext.Provider value={{ styles, setStyles }}>
			{children}
		</StylesContext.Provider>
	);
};

export { useStylesContext, StylesProvider };
