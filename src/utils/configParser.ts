import { isValidElement } from "react";

import { processAndFetchThemeConfig } from "../services/ThemeService";
import { Settings } from "../types/Settings";
import { Styles } from "../types/Styles";
import { Theme } from "../types/Theme";
import { DefaultSettings } from "../constants/internal/DefaultSettings";
import { DefaultStyles } from "../constants/internal/DefaultStyles";

/**
 * Retrieves default values for chatbot settings.
 */
export const getDefaultSettings = (): Settings => {
	return deepClone(DefaultSettings);
}

/**
 * Retrieves default values for chatbot styles.
 */
export const getDefaultStyles = (): Styles => {
	return deepClone(DefaultStyles);
}

/**
 * Parses default settings and styles with user provided config to generate final settings and styles.
 * 
 * @param providedSettings settings provided by the user to the bot
 * @param providedStyles styles provided by the user to the bot
 * @param themes themes provided by the user to the bot
 */
export const parseConfig = async (providedSettings: Settings | undefined,
	providedStyles: Styles | undefined, themes: undefined | Theme | Array<Theme>):
	Promise<{settings: Settings, inlineStyles: Styles, cssStylesText: string}> => {

	let combinedSettings = getDefaultSettings();
	let combinedStyles = getDefaultStyles();
	let cssStylesText = getDefaultCssStylesText();

	// process themes first
	if (themes != null) {
		// always remove all theme styles before processing provided themes
		const existingStyleElements = document.querySelectorAll('[id^="rcb-theme-style"]');
		existingStyleElements.forEach(element => {
			element.remove();
		});

		if (Array.isArray(themes)) {
			for (const theme of themes) {
				const themeConfig = await processAndFetchThemeConfig(theme);
				combinedSettings = getCombinedConfig(themeConfig.settings, combinedSettings) as Settings;
				combinedStyles = getCombinedConfig(themeConfig.inlineStyles, combinedStyles) as Styles;
				cssStylesText += themeConfig.cssStylesText;
			}
		} else {
			const themeConfig = await processAndFetchThemeConfig(themes);
			combinedSettings = getCombinedConfig(themeConfig.settings, combinedSettings) as Settings;
			combinedStyles = getCombinedConfig(themeConfig.inlineStyles, combinedStyles) as Styles;
			cssStylesText += themeConfig.cssStylesText;
		}
	}

	// process provided settings/styles
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

	return {settings: combinedSettings, inlineStyles: combinedStyles, cssStylesText};
}

/**
 * Combines default and provided config.
 * 
 * @param preferredConfig config provided by the user to the bot
 * @param baseConfig the base config that the provided config will overwrite
 */
const getCombinedConfig = (preferredConfig: Settings | Styles, baseConfig: Settings |
	Styles): Settings | Styles => {

	const stack: Array<{ source: object, target: object }> = [{ source: preferredConfig, target: baseConfig }];
	
	while (stack.length) {
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
				typeof source[keyAsObjectType] === "object" && 
				source[keyAsObjectType] !== null && 
				!Array.isArray(source[keyAsObjectType])
			) {
				stack.push({ source: source[keyAsObjectType], target: target[keyAsObjectType] });
			} else {
				try {
					target[keyAsObjectType] = source[keyAsObjectType];
				} catch {
					// if error, ignore
				}
			}
		}
	}

	return baseConfig;
}

// caches default rcb styles
let cachedDefaultRcbStyles: string | null = null;

/**
 * Fetches all global styles with class names prefixed with `rcb-` and caches the result.
 */
const getDefaultCssStylesText = (): string => {
	// if has cached default styles, return it
	if (cachedDefaultRcbStyles !== null) {
		return cachedDefaultRcbStyles;
	}

	let rcbStyles = "";

	// iterate over stylesheets to look for rcb styles
	Array.from(document.styleSheets).forEach((styleSheet) => {
		try {
			Array.from(styleSheet.cssRules).forEach((rule) => {
				// rcb styles are identified with a prefix
				if (rule instanceof CSSStyleRule && rule.selectorText.startsWith(".rcb-")) {
					rcbStyles += rule.cssText + "\n";
				}
			});
		} catch (error) {
			console.warn(`Unable to access stylesheet: ${styleSheet.href}`, error);
		}
	});

	// cache the result
	cachedDefaultRcbStyles = rcbStyles;
	return rcbStyles;
};


/**
 * Deep clones a javascript object.
 * 
 * @param obj object to clone
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
const deepClone = (obj: { [key: string]: any }): { [key: string]: any } => {
	if (obj === null || typeof obj !== "object") {
		return obj;
	}

	const root: { [key: string]: any } = Array.isArray(obj) ? [] : {};
	const stack: Array<{ source: { [key: string]: any }, target: { [key: string]: any } }> =
		[{ source: obj, target: root }];
	const seen = new WeakMap<{ [key: string]: any }, { [key: string]: any }>();
	seen.set(obj, root);

	while (stack.length) {
		const poppedItem = stack.pop();
		if (poppedItem == null) {
			continue;
		}

		const { source, target } = poppedItem;
		for (const key in source) {
			if (Object.prototype.hasOwnProperty.call(source, key)) {
				const value = source[key];
				
				if (value && typeof value === "object") {
					if (seen.has(value)) {
						target[key] = seen.get(value);
					} else {
						const clone: { [key: string]: any } = Array.isArray(value) ? [] : {};
						seen.set(value, clone);
						target[key] = clone;
						stack.push({ source: value, target: clone });
					}
				} else {
					target[key] = value;
				}
			}
		}
	}

	return root;
};