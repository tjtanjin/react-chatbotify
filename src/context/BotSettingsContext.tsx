import { useContext, createContext, Dispatch, SetStateAction } from "react";

import { BotSettings } from "../types/BotSettings";

/**
 * Creates the useBotSettings() hook to manage bot botSettings.
 */
type BotSettingsContextType = {
	botSettings: BotSettings;
	setBotSettings: Dispatch<SetStateAction<BotSettings>>;
}
const BotSettingsContext = createContext<BotSettingsContextType>({botSettings: {}, setBotSettings: () => null});
const useBotSettings = () => useContext(BotSettingsContext);

export {
	BotSettingsContext,
	useBotSettings
};