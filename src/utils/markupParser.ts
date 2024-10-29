/**
 * Parses message that has markup enabled (holds html tags as individual elements to enable smooth streaming).
 * 
 * @param message message to parse
 */
export const parseMarkupMessage = (message: string) => {
	const result: string[] = [];
	let currentTag = "";
	let isInTag = false;

	for (let i = 0; i < message.length; i++) {
		const char = message[i];

		if (char === "<") {
			// detects start of html tag
			if (!isInTag) {
				isInTag = true;
				currentTag = char;
			} else {
				result.push(currentTag);
				currentTag = char;
			}
		} else if (char === ">") {
			// detects end of html tag
			currentTag += char;
			result.push(currentTag);
			currentTag = "";
			isInTag = false;
		} else {
			// handles normal character 
			if (isInTag) {
				currentTag += char;
			} else {
				result.push(char);
			}
		}
	}
  
	if (currentTag !== "") {
		result.push(currentTag);
	}
	return result;
}

/**
 * Strips HTML tags from a string using DOMParser.
 *
 * @param html HTML string to strip tags from
 */
export const stripHtml = (html: string) => {
	if (typeof window.DOMParser !== "undefined") {
		const parser = new DOMParser();
		const doc = parser.parseFromString(html, "text/html");
		return doc.body.textContent || "";
	}

	// fallback for environments without DOMParser
	return html.replace(/<\/?[^>]+(>|$)/g, "");
}