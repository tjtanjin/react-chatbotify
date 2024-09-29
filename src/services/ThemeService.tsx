import { Settings } from "../types/Settings";
import { Styles } from "../types/Styles";
import { Theme } from "../types/Theme";
import { ThemeCacheData } from "../types/internal/ThemeCacheData";

const DEFAULT_URL = import.meta.env?.VITE_THEME_BASE_CDN_URL;
const DEFAULT_EXPIRATION = import.meta.env?.VITE_THEME_DEFAULT_CACHE_EXPIRATION;
const CACHE_KEY_PREFIX = import.meta.env?.VITE_THEME_CACHE_KEY_PREFIX;

/**
 * Fetches the cached theme if it exist and checks for expiry.
 *
 * @param id id of the theme
 * @param version version of the theme
 * @param cacheDuration duration that the theme should be cached for
 */
export const getCachedTheme = (id: string, version: string, cacheDuration: number): ThemeCacheData | null => {
	const cachedTheme = localStorage.getItem(`${CACHE_KEY_PREFIX}_${id}_${version}`);

	// if unable to find theme, not cached so return null
	if (!cachedTheme) {
		return null;
	}

	try {
		const parsedCacheTheme: ThemeCacheData = JSON.parse(cachedTheme);
		const milliseconds = new Date().getTime();
		const currentTimeInSeconds = Math.floor(milliseconds / 1000);
		// if cache date + duration is greater than current time, then cache is still valid
		if (parsedCacheTheme.cacheDate + cacheDuration >= currentTimeInSeconds) {
			return parsedCacheTheme;
		}
		return null;
	} catch (error) {
		console.error(`Unable to fetch cache for ${id}`, error);
		return null;
	}
}

/**
 * Saves a theme to cache.
 *
 * @param id id of the theme
 * @param version version of the theme
 * @param settings settings to cache
 * @param inlineStyles inline styles to cache
 * @param cssStylesText css styles to cache
 */
export const setCachedTheme = (id: string, version: string, settings: Settings, inlineStyles: Styles,
	cssStylesText: string) => {

	const milliseconds = new Date().getTime();
	const currentTimeInSeconds = Math.floor(milliseconds / 1000);

	const themeCacheData: ThemeCacheData = {
		settings,
		inlineStyles,
		cssStylesText,
		cacheDate: currentTimeInSeconds
	};

	localStorage.setItem(`${CACHE_KEY_PREFIX}_${id}_${version}`, JSON.stringify(themeCacheData));
}

/**
 * Applies the CSS styles directly to the shadow DOM.
 *
 * @param shadowRoot shadow DOM root where styles should be applied
 * @param cssStylesText css styles to apply (as a string)
 */
export const applyCssStyles = async (shadowRoot: ShadowRoot, cssStylesText: string) => {	
	try {
		const styleElement = document.createElement("style");
		styleElement.textContent = cssStylesText;
		shadowRoot.appendChild(styleElement);
	} catch (error) {
		console.warn("Failed to scope styles to chatbot", error);
	}
};

/**
 * Fetches the theme version from meta.json file.
 *
 * @param id id of the theme
 * @param baseUrl base url to fetch meta file from
 */
const fetchThemeVersionFromMeta = async (id: string, baseUrl: string) => {
	const metadataUrl = `${baseUrl}/${id}/meta.json`;
	try {
		const response = await fetch(metadataUrl);
		if (!response.ok) {
			console.error(`Failed to fetch meta.json from ${metadataUrl}`);
			return null;
		}
		const metadata = await response.json();
		return metadata.version;
	} catch (error) {
		console.error(`Failed to fetch meta.json from ${metadataUrl}`, error);
		return null;
	}
}

/**
 * Processes information for a given theme and retrieves its settings via CDN.
 * 
 * @param theme theme to process and retrieve config for
 */
export const processAndFetchThemeConfig = async (theme: Theme):
	Promise<{settings: Settings, inlineStyles: Styles, cssStylesText: string}> => {

	const { id, version, baseUrl = DEFAULT_URL, cacheDuration = DEFAULT_EXPIRATION } = theme;
	const themeVersion = version ? version : await fetchThemeVersionFromMeta(id, baseUrl);

	// if still cannot get version even from meta.json, return
	if (!themeVersion) {
		console.error(`Unable to find version for theme: ${id}`);
		return {settings: {}, inlineStyles: {}, cssStylesText: ""};
	}

	// try to get non-expired theme cache for specified theme and version
	const cache = getCachedTheme(id, themeVersion, cacheDuration);
	if (cache) {
		return { settings: cache.settings, inlineStyles: cache.inlineStyles, cssStylesText: cache.cssStylesText}
	}

	// for no cache found, construct urls for styles.css, settings.json and settings.json
	const cssStylesUrl = `${baseUrl}/${id}/${themeVersion}/styles.css`;
	const settingsUrl = `${baseUrl}/${id}/${themeVersion}/settings.json`;
	const inlineStylesUrl = `${baseUrl}/${id}/${themeVersion}/styles.json`;

	// fetch and apply css styles
	let cssStylesText = "";
	const cssStylesResponse = await fetch(cssStylesUrl);
	if (cssStylesResponse.ok) {
		cssStylesText = await cssStylesResponse.text();
	} else {
		console.info(`Could not fetch styles.css from ${cssStylesUrl}`);
	}

	// fetch and return settings
	const settingsResponse = await fetch(settingsUrl);
	let settings = {};
	if (settingsResponse.ok) {
		settings = await settingsResponse.json();
	} else {
		console.info(`Could not fetch settings.json from ${settingsUrl}`);
	}

	// fetch and return styles
	const inlineStylesResponse = await fetch(inlineStylesUrl);
	let inlineStyles = {};
	if (inlineStylesResponse.ok) {
		inlineStyles = await inlineStylesResponse.json();
	} else {
		console.info(`Could not fetch styles.json from ${inlineStylesUrl}`);
	}

	setCachedTheme(id, themeVersion, settings, inlineStyles, cssStylesText);
	return {settings, inlineStyles, cssStylesText};
}
