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
	const { name, version, base_url = DEFAULT_URL } = theme;

	let themeVersion = version;

	// if version is not specified, get from meta.json
	if (!version) {
		const metadataUrl = `${base_url}/${name}/meta.json`;
		try {
			const response = await fetch(metadataUrl);
			if (!response.ok) {
				throw new Error(`Failed to fetch meta.json from ${metadataUrl}`);
			}
			const metadata = await response.json();
			themeVersion = metadata.version;
		} catch (error) {
			console.error("Error fetching meta.json:", error);
		}
	}

	// construct urls for styles.css, settings.json and settings.json
	const cssStylesUrl = `${base_url}/${name}/${themeVersion}/styles.css`;
	const settingsUrl = `${base_url}/${name}/${themeVersion}/settings.json`;
	const stylesUrl = `${base_url}/${name}/${themeVersion}/styles.json`;

	// fetch and apply css styles
	try {
		const cssStylesResponse = await fetch(cssStylesUrl);
		if (!cssStylesResponse.ok) {
			throw new Error(`Failed to fetch styles.css from ${cssStylesUrl}`);
		}
		const cssStylesText = await cssStylesResponse.text();
		const cssStyleSheet = document.createElement("style");
		cssStyleSheet.type = "text/css";
		cssStyleSheet.innerText = cssStylesText;
		document.head.appendChild(cssStyleSheet);
	} catch (error) {
		console.error("Error fetching styles.css:", error);
	}

	// fetch and return settings
	const settingsResponse = await fetch(settingsUrl);
	if (!settingsResponse.ok) {
		throw new Error(`Failed to fetch settings.json from ${settingsUrl}`);
	}
	const settings = await settingsResponse.json();

	// fetch and return styles
	const stylesResponse = await fetch(stylesUrl);
	if (!stylesResponse.ok) {
		throw new Error(`Failed to fetch styles.json from ${stylesUrl}`);
	}
	const styles = await stylesResponse.json();

	return {settings, styles}

}
