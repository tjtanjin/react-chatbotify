import { useContext, createContext, Dispatch, SetStateAction } from "react";

import { Styles } from "../types/Styles";

/**
 * Creates the useBotStyles() hook to manage bot botStyles.
 */
type StylesContextType = {
	botStyles: Styles;
	setBotStyles: Dispatch<SetStateAction<Styles>>;
}
const BotStylesContext = createContext<StylesContextType>({botStyles: {}, setBotStyles: () => null});
const useBotStyles = () => useContext(BotStylesContext);

export {
	BotStylesContext,
	useBotStyles
};