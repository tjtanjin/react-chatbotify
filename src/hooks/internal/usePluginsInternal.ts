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

	// initializes plugins and retrieves metadata for setup
	const pluginMetaData = plugins?.map((pluginHook) => pluginHook());

	useEffect(() => {
		let pluginSettings = {};
		let pluginStyles = {};
		// applies plugin settings and styles if specified
		pluginMetaData?.forEach((pluginMetaData) => {
			if (pluginMetaData?.settings && Object.keys(pluginMetaData?.settings).length !== 0) {
				pluginSettings = getCombinedConfig(pluginMetaData.settings, pluginSettings);
			}
			if (pluginMetaData?.styles && Object.keys(pluginMetaData?.styles).length !== 0) {
				pluginStyles = getCombinedConfig(pluginMetaData.styles, pluginStyles);
			}
		});

		updateSettings(pluginSettings);
		updateStyles(pluginStyles);
	}, [plugins])
};
