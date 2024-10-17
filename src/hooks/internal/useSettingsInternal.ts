import { deepClone, getCombinedConfig } from "../../utils/configParser";
import { useSettingsContext } from "../../context/SettingsContext";
import { Settings } from "../../types/Settings";

/**
 * Internal custom hook for managing settings.
 */
export const useSettingsInternal = () => {
	// handles settings
	const { settings, setSettings } = useSettingsContext();

    /**
     * Updates the settings for the chatbot.
     *
     * @param fields fields to update
     */
    const updateSettings = (fields: object) => {
        setSettings(deepClone(getCombinedConfig(fields, settings) as Settings));
    }

	return {
		settings,
		setSettings,
        updateSettings
	};
};
