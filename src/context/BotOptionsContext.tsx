import { useContext, createContext, Dispatch, SetStateAction } from "react";

import { Options } from "../types/Options";

/**
 * Creates the useBotOptions() hook to manage bot options.
 */
type BotOptionsContextType = {
	botOptions: Options;
	setBotOptions: Dispatch<SetStateAction<Options>>;
}
const BotOptionsContext = createContext<BotOptionsContextType>({botOptions: {}, setBotOptions: () => null});
const useBotOptions = () => useContext(BotOptionsContext);

export {
	BotOptionsContext,
	useBotOptions
};