declare namespace Cypress {
	interface Chainable {
		chatbotify: {
			getCachedTheme: typeof import("../../src/services/ThemeService").getCachedTheme;
			setCachedTheme: typeof import("../../src/services/ThemeService").setCachedTheme;
		};
	}
}