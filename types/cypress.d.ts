declare namespace Cypress {
    interface Chainable<Subject = any> {
        chatbotify: {
            getCachedTheme(id: string, version: string, cacheDuration: number): ThemeCacheData | null
            setCachedTheme(id: string, version: string, settings: Settings, inlineStyles: Styles, cssStylesText: string)
        }
        
    }
}