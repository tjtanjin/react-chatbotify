import { useContext, createContext, Dispatch, SetStateAction } from "react";

import { Settings } from "../types/Settings";
import { DefaultSettings } from "../constants/internal/DefaultSettings";

/**
 * Creates the useSettingsContext() hook to manage settings for the chatbot.
 */
type SettingsContextType = {
	settings: Settings;
	setSettings: Dispatch<SetStateAction<Settings>>;
};
const SettingsContext = createContext<SettingsContextType>({settings: {}, setSettings: () => null});
const useSettingsContext = () => useContext(SettingsContext);

/**
 * Creates provider to wrap the chatbot container.
 */
const SettingsProvider = ({
	children,
	settings = DefaultSettings,
	setSettings
}: {
	children: React.ReactNode;
	settings: Settings;
	setSettings: Dispatch<SetStateAction<Settings>>;
}) => {
	return (
		<SettingsContext.Provider value={{ settings, setSettings }}>
			{children}
		</SettingsContext.Provider>
	);
};

export { useSettingsContext, SettingsProvider };
