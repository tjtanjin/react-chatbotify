import { isValidElement } from "react";

import { processAndFetchThemeConfig } from "../services/ThemeService";
import { BotSettings } from "../types/BotSettings";
import { BotStyles } from "../types/BotStyles";
import { Theme } from "../types/Theme";
import { DefaultSettings } from "../constants/DefaultSettings";
import { DefaultStyles } from "../constants/DefaultStyles";

/**
 * Parses default settings and styles with user provided config to generate final bot bot settings and styles.
 * 
 * @param providedSettings settings provided by the user to the bot
 * @param providedStyles styles provided by the user to the bot
 * @param theme theme provided by the user to the bot
 */
export const parseConfig = async (providedSettings: BotSettings | undefined,
	providedStyles: BotStyles | undefined,
	themes: undefined | Theme | Array<Theme>): Promise<{settings: BotSettings, styles: BotStyles}> => {


	let combinedStyles = DefaultStyles;
	let combinedSettings = DefaultSettings;
	if (themes != null) {
		if (Array.isArray(themes)) {
			for (const theme of themes) {
				const themeConfig = await processAndFetchThemeConfig(theme);
				combinedSettings = getCombinedConfig(themeConfig.settings, DefaultSettings) as BotSettings;
				combinedStyles = getCombinedConfig(themeConfig.styles, DefaultStyles) as BotStyles;
			}
		} else {
			const themeConfig = await processAndFetchThemeConfig(themes);
			combinedSettings = getCombinedConfig(themeConfig.settings, DefaultSettings) as BotSettings;
			combinedStyles = getCombinedConfig(themeConfig.styles, DefaultStyles) as BotStyles;
		}
	}

	if (providedSettings != null) {
		combinedSettings = getCombinedConfig(providedSettings, combinedSettings) as BotSettings;
	}

	if (providedStyles != null) {
		combinedStyles = getCombinedConfig(providedStyles, combinedStyles) as BotStyles;
	}

	// enforces value for bot delay does not go below 500
	if (combinedSettings.chatInput?.botDelay != null && combinedSettings.chatInput?.botDelay < 500) {
		combinedSettings.chatInput.botDelay = 500;
	}

	return {settings: combinedSettings, styles: combinedStyles};
}

/**
 * Combines default and provided config.
 * 
 * @param preferredConfig config provided by the user to the bot
 * @param baseConfig the base config that the provided config will overwrite
 */
const getCombinedConfig = (preferredConfig: BotSettings | BotStyles, baseConfig: BotSettings |
	BotStyles): BotSettings | BotStyles => {

	const stack: Array<{ source: object, target: object }> = [{ source: preferredConfig, target: baseConfig }];
	
	while (stack.length > 0) {
		const poppedItem = stack.pop();
		if (poppedItem == null) {
			continue;
		}

		const { source, target } = poppedItem;
		for (const key of Object.keys(source)) {
			const keyAsObjectType = key as keyof object;
			if (isValidElement(source[keyAsObjectType])) {
				target[keyAsObjectType] = source[keyAsObjectType];
			} else if (
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