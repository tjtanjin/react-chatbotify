import { Options } from "react-chatbotify";
import { Theme } from "../types/Theme";

const DEFAULT_URL = import.meta.env.VITE_THEME_BASE_CDN_URL;

/**
 * Processes information for a given theme and retrieves its options via CDN.
 * 
 * @param theme theme to process and retrieve options for
 */
export const processAndFetchThemeOptions = async (theme: Theme): Promise<Options> => {
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

	// construct urls for styles.css and options.json
	const stylesUrl = `${base_url}/${name}/${themeVersion}/styles.css`;
	const optionsUrl = `${base_url}/${name}/${themeVersion}/options.json`;

	// fetch and apply styles
	try {
		const stylesResponse = await fetch(stylesUrl);
		if (!stylesResponse.ok) {
			throw new Error(`Failed to fetch styles.css from ${stylesUrl}`);
		}
		const stylesText = await stylesResponse.text();
		const styleSheet = document.createElement("style");
		styleSheet.type = "text/css";
		styleSheet.innerText = stylesText;
		document.head.appendChild(styleSheet);
	} catch (error) {
		console.error("Error fetching styles.css:", error);
	}

	// fetch and return options
	const optionsResponse = await fetch(optionsUrl);
	if (!optionsResponse.ok) {
		throw new Error(`Failed to fetch options.json from ${optionsUrl}`);
	}
	const options = await optionsResponse.json();
	return options;

}
