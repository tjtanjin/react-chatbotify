import { Dispatch, SetStateAction, useEffect } from "react";

import { useSettingsInternal } from "./useSettingsInternal";
import { useStylesInternal } from "./useStylesInternal";
import { Plugin } from "../../types/Plugin";
import { Theme } from "../../types/Theme";

/**
 * Internal custom hook to handle plugins.
 */
export const usePluginsInternal = (plugins: Array<Plugin> | undefined,
	setFinalThemes: Dispatch<SetStateAction<Theme | Array<Theme>>>) => {

	const { updateSettings } = useSettingsInternal();
	const { updateStyles } = useStylesInternal();

	// initializes plugins
	const configs = plugins?.map((pluginHook) => pluginHook());

	useEffect(() => {
		// applies plugin themes, settings and styles if specified
		configs?.forEach((pluginConfig) => {
			if (pluginConfig.themes) {
				if (Array.isArray(pluginConfig.themes)) {
					setFinalThemes(prev => {
						if (Array.isArray(prev)) {
							return [...prev, ...pluginConfig.themes as Array<Theme>];
						} else {
							return [prev, ...pluginConfig.themes as Array<Theme>];
						}
					});
				} else {
					setFinalThemes(prev => {
						if (Array.isArray(prev)) {
							return [...prev, pluginConfig.themes as Theme];
						} else {
							return [prev, pluginConfig.themes as Theme];
						}
					});
				}
			}
			if (pluginConfig?.settings) {
				updateSettings(pluginConfig.settings);
			}
			if (pluginConfig?.styles) {
				updateStyles(pluginConfig.styles);
			}
		});
	}, [plugins])
};
