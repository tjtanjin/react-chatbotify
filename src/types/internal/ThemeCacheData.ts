import { Settings } from "../Settings";
import { Styles } from "../Styles";

/**
 * Defines the configuration options for caching theme data.
 */
export type ThemeCacheData = {
	settings: Settings;
	inlineStyles: Styles;
	cssStylesText: string;
	cacheDate: number;
}