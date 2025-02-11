declare namespace Cypress {
	type Chainable = {
		chatbotify: {
			getCachedTheme: typeof import("../../src/services/ThemeService").getCachedTheme;
			setCachedTheme: typeof import("../../src/services/ThemeService").setCachedTheme;
		};
	}
}