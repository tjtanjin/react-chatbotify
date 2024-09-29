/**
 * Checks if chatbot is visible (uses chatbot body as reference).
 * 
 * @param element chatbot body used to gauge visibility
 */
export const isChatBotVisible = (element: HTMLDivElement) => {
	if (!element) {
		return false;
	}

	const rect = element.getBoundingClientRect();
	const windowHeight = (window.innerHeight ?? document.documentElement.clientHeight);
	const windowWidth = (window.innerWidth ?? document.documentElement.clientWidth);

	return (
		rect.top >= 0 &&
		rect.left >= 0 &&
		rect.bottom <= windowHeight &&
		rect.right <= windowWidth
	);
}