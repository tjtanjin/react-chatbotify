import { Settings } from "../types/Settings";
import { Styles } from "../types/Styles";
import { Theme } from "../types/Theme";

const DEFAULT_URL = import.meta.env.VITE_THEME_BASE_CDN_URL;

/**
 * Processes information for a given theme and retrieves its settings via CDN.
 * 
 * @param theme theme to process and retrieve settings for
 */
export const processAndFetchThemeConfig = async (theme: Theme): Promise<{settings: Settings, styles: Styles}> => {
	const { id, version, base_url = DEFAULT_URL } = theme;

	let themeVersion = version;

	// if version is not specified, get from meta.json
	if (!version) {
		const metadataUrl = `${base_url}/${id}/meta.json`;
		try {
			const response = await fetch(metadataUrl);
			if (!response.ok) {
				throw new Error(`Failed to fetch meta.json from ${metadataUrl}`);
			}
			const metadata = await response.json();
			themeVersion = metadata.version;
		} catch (error) {
			console.error(`Failed to fetch meta.json from ${metadataUrl}`, error);
			return {settings: {}, styles: {}};
		}
	}

	// construct urls for styles.css, settings.json and settings.json
	const cssStylesUrl = `${base_url}/${id}/${themeVersion}/styles.css`;
	const settingsUrl = `${base_url}/${id}/${themeVersion}/settings.json`;
	const inlineStylesUrl = `${base_url}/${id}/${themeVersion}/styles.json`;

	// fetch and apply css styles
	try {
		const cssStylesResponse = await fetch(cssStylesUrl);
		if (!cssStylesResponse.ok) {
			throw new Error(`Failed to fetch styles.css from ${cssStylesUrl}`);
		}
		const cssStylesText = await cssStylesResponse.text();
		
		// Create and append new style element
		const cssLinkElement = document.createElement("link");
		cssLinkElement.id = `rcb-theme-style-${id}`;
		cssLinkElement.rel = "stylesheet";
		cssLinkElement.href = `data:text/css;charset=utf-8,${encodeURIComponent(cssStylesText)}`;
		document.head.appendChild(cssLinkElement);
	} catch (error) {
		console.error(`Failed to fetch styles.css from ${cssStylesUrl}`, error);
	}

	// fetch and return settings
	const settingsResponse = await fetch(settingsUrl);
	let settings = {};
	if (settingsResponse.ok) {
		settings = await settingsResponse.json();
	} else {
		console.error(`Failed to fetch settings.json from ${settingsUrl}`);
	}

	// fetch and return styles
	const inlineStylesResponse = await fetch(inlineStylesUrl);
	let inlineStyles = {};
	if (inlineStylesResponse.ok) {
		inlineStyles = await inlineStylesResponse.json();
	} else {
		console.error(`Failed to fetch styles.json from ${inlineStylesUrl}`);
	}

	return {settings, styles: inlineStyles}
}
