import { useEffect } from "react";

import { getCombinedConfig } from "../../utils/configParser";
import { useSettingsInternal } from "./useSettingsInternal";
import { useStylesInternal } from "./useStylesInternal";
import { Plugin } from "../../types/Plugin";

/**
 * Internal custom hook to handle plugins.
 */
export const usePluginsInternal = (plugins: Array<Plugin> | undefined) => {

	const { updateSettings } = useSettingsInternal();
	const { updateStyles } = useStylesInternal();

	// initializes plugins and retrieves info for setup
	const setUpInfo = plugins?.map((pluginHook) => pluginHook());

	useEffect(() => {
		let pluginSettings = {};
		let pluginStyles = {};
		// applies plugin themes, settings and styles if specified
		setUpInfo?.forEach((setUpInfo) => {
			if (setUpInfo?.settings && Object.keys(setUpInfo?.settings).length !== 0) {
				pluginSettings = getCombinedConfig(setUpInfo.settings, pluginSettings);
			}
			if (setUpInfo?.styles && Object.keys(setUpInfo?.styles).length !== 0) {
				pluginStyles = getCombinedConfig(setUpInfo.styles, pluginStyles);
			}
		});

		updateSettings(pluginSettings);
		updateStyles(pluginStyles);
	}, [plugins])
};
