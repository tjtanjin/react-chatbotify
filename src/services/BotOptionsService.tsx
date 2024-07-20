import { processAndFetchThemeOptions } from "./ThemeService";
import { Options } from "../types/Options";
import { Theme } from "../types/Theme";
import { DefaultOptions } from "../constants/DefaultOptions";

/**
 * Parses default options with user provided options to generate final bot options.
 * 
 * @param providedOptions options provided by the user to the bot
 * @param theme theme provided by the user to the bot
 */
export const parseBotOptions = async (providedOptions: Options | undefined,
	themes: undefined | Theme | Array<Theme>): Promise<Options> => {
	
	// if no provided options or theme, then just load default options
	if (providedOptions == null && themes == undefined) {
		return DefaultOptions;
	}

	let combinedOptions = DefaultOptions;
	if (themes != null) {
		if (Array.isArray(themes)) {
			for (const theme of themes) {
				const themeOptions = await processAndFetchThemeOptions(theme);
				combinedOptions = getCombinedOptions(themeOptions, DefaultOptions);
			}
		} else {
			const themeOptions = await processAndFetchThemeOptions(themes);
			combinedOptions = getCombinedOptions(themeOptions, DefaultOptions);
		}
	}

	if (providedOptions != null) {
		combinedOptions = getCombinedOptions(providedOptions, combinedOptions);
	}

	// enforces value for bot delay does not go below 500
	if (combinedOptions.chatInput?.botDelay != null && combinedOptions.chatInput?.botDelay < 500) {
		combinedOptions.chatInput.botDelay = 500;
	}

	return combinedOptions;
}

/**
 * Combines default and provided options.
 * 
 * @param providedOptions options provided by the user to the bot
 * @param baseOptions the base options that the provided options will overwrite
 */
const getCombinedOptions = (preferredOptions: Options, baseOptions: Options): Options => {
	const stack: Array<{ source: object, target: object }> = [{ source: preferredOptions, target: baseOptions }];
	
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

	return baseOptions;
}