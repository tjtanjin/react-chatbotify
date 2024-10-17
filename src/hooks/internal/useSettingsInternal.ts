import { getCombinedConfig } from "../../utils/configParser";
import { useSettingsContext } from "../../context/SettingsContext";
import { Settings } from "../../types/Settings";

/**
 * Internal custom hook for managing settings.
 */
export const useSettingsInternal = () => {
	// handles settings
	const { settings, setSettings } = useSettingsContext();

    const updateSettings = (fields: object) => {
        setSettings(getCombinedConfig(fields, settings) as Settings);
    }

	return {
		settings,
		setSettings,
        updateSettings
	};
};
