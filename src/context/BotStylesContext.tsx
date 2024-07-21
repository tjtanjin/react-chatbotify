import { useContext, createContext, Dispatch, SetStateAction } from "react";

import { BotStyles } from "../types/BotStyles";

/**
 * Creates the useBotStyles() hook to manage bot botStyles.
 */
type BotStylesContextType = {
	botStyles: BotStyles;
	setBotStyles: Dispatch<SetStateAction<BotStyles>>;
}
const BotStylesContext = createContext<BotStylesContextType>({botStyles: {}, setBotStyles: () => null});
const useBotStyles = () => useContext(BotStylesContext);

export {
	BotStylesContext,
	useBotStyles
};