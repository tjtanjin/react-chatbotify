import { processAndFetchThemeConfig } from "../services/ThemeService";
import { Settings } from "../types/Settings";
import { Styles } from "../types/Styles";
import { Theme } from "../types/Theme";
import { DefaultSettings } from "../constants/DefaultSettings";
import { DefaultStyles } from "../constants/DefaultStyles";

/**
 * Parses default settings with user provided options to generate final bot botSettings.
 * 
 * @param providedSettings settings provided by the user to the bot
 * @param providedStyles styles provided by the user to the bot
 * @param theme theme provided by the user to the bot
 */
export const parseConfig = async (providedSettings: Settings | undefined,
	providedStyles: Styles | undefined,
	themes: undefined | Theme | Array<Theme>): Promise<{settings: Settings, styles: Styles}> => {


	let combinedStyles = DefaultStyles;
	let combinedSettings = DefaultSettings;
	if (themes != null) {
		if (Array.isArray(themes)) {
			for (const theme of themes) {
				const themeConfig = await processAndFetchThemeConfig(theme);
				combinedSettings = getCombinedConfig(themeConfig.settings, DefaultSettings) as Settings;
				combinedStyles = getCombinedConfig(themeConfig.styles, DefaultStyles) as Styles;
			}
		} else {
			const themeConfig = await processAndFetchThemeConfig(themes);
			combinedSettings = getCombinedConfig(themeConfig.settings, DefaultSettings) as Settings;
			combinedStyles = getCombinedConfig(themeConfig.styles, DefaultStyles) as Styles;
		}
	}

	if (providedSettings != null) {
		combinedSettings = getCombinedConfig(providedSettings, combinedSettings) as Settings;
	}

	if (providedStyles != null) {
		combinedStyles = getCombinedConfig(providedStyles, combinedStyles) as Styles;
	}

	// enforces value for bot delay does not go below 500
	if (combinedSettings.chatInput?.botDelay != null && combinedSettings.chatInput?.botDelay < 500) {
		combinedSettings.chatInput.botDelay = 500;
	}

	return {settings: combinedSettings, styles: combinedStyles};
}

/**
 * Combines default and provided options.
 * 
 * @param providedOptions options provided by the user to the bot
 * @param baseOptions the base options that the provided options will overwrite
 */
const getCombinedConfig = (preferredOptions: Settings | Styles, baseConfig: Settings | Styles): Settings | Styles => {
	const stack: Array<{ source: object, target: object }> = [{ source: preferredOptions, target: baseConfig }];
	
	while (stack.length > 0) {
		const poppedItem = stack.pop();
		if (poppedItem == null) {
			continue;
		}

		const { source, target } = poppedItem;
		for (const key of Object.keys(source)) {
			const keyAsObjectType = key as keyof object;
			if (
				typeof source[keyAsObjectType] === 'object' && 
				source[keyAsObjectType] !== null && 
				keyAsObjectType !== 'buttons'
			) {
				stack.push({ source: source[keyAsObjectType], target: target[keyAsObjectType] });
			} else {
				target[keyAsObjectType] = source[keyAsObjectType];
			}
		}
	}

	return baseConfig;
}