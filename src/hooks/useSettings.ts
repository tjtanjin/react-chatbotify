import { useSettingsContext } from "../context/SettingsContext";

/**
 * External custom hook for managing settings.
 */
export const useSettings = () => {
	// handles settings
	const { settings, setSettings } = useSettingsContext();

	return {
		settings,
		setSettings
	};
};
