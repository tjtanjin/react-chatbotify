import { useContext, createContext, Dispatch, SetStateAction } from "react";

import { Settings } from "../types/Settings";

/**
 * Creates the useSettings() hook to manage bot settings.
 */
type SettingsContextType = {
	settings: Settings;
	setSettings: Dispatch<SetStateAction<Settings>>;
}
const SettingsContext = createContext<SettingsContextType>({settings: {}, setSettings: () => null});
const useSettings = () => useContext(SettingsContext);

export {
	SettingsContext,
	useSettings
};