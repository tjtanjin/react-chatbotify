import { useSettingsInternal } from "./internal/useSettingsInternal";

/**
 * External custom hook for managing settings.
 */
export const useSettings = () => {
	// handles settings
	const { settings, setSettings, updateSettings } = useSettingsInternal();

	return {
		settings,
		setSettings,
		updateSettings
	};
};
