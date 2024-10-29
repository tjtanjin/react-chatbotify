import { useSettingsInternal } from "./internal/useSettingsInternal";

/**
 * External custom hook for managing settings.
 */
export const useSettings = () => {
	// handles settings
	const { settings, replaceSettings, updateSettings } = useSettingsInternal();

	return {
		settings,
		replaceSettings,
		updateSettings
	};
};
