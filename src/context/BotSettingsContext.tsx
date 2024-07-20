import { useContext, createContext, Dispatch, SetStateAction } from "react";

import { Settings } from "../types/Settings";

/**
 * Creates the useBotSettings() hook to manage bot botSettings.
 */
type SettingsContextType = {
	botSettings: Settings;
	setBotSettings: Dispatch<SetStateAction<Settings>>;
}
const BotSettingsContext = createContext<SettingsContextType>({botSettings: {}, setBotSettings: () => null});
const useBotSettings = () => useContext(BotSettingsContext);

export {
	BotSettingsContext,
	useBotSettings
};