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

	// initializes plugins and retrieves info for setup
	const setUpInfo = plugins?.map((pluginHook) => pluginHook());

	useEffect(() => {
		// applies plugin themes, settings and styles if specified
		setUpInfo?.forEach((setUpInfo) => {
			if (setUpInfo?.themes) {
				if (Array.isArray(setUpInfo.themes)) {
					setFinalThemes(prev => {
						if (Array.isArray(prev)) {
							return [...prev, ...setUpInfo.themes as Array<Theme>];
						} else {
							return [prev, ...setUpInfo.themes as Array<Theme>];
						}
					});
				} else {
					setFinalThemes(prev => {
						if (Array.isArray(prev)) {
							return [...prev, setUpInfo.themes as Theme];
						} else {
							return [prev, setUpInfo.themes as Theme];
						}
					});
				}
			}
			if (setUpInfo?.settings) {
				updateSettings(setUpInfo.settings);
			}
			if (setUpInfo?.styles) {
				updateStyles(setUpInfo.styles);
			}
		});
	}, [plugins])
};
