import { expect } from "@jest/globals";

// Import the functions to be tested and types needed for the theme data
import {
  getCachedTheme,
  setCachedTheme,
} from "../../src/services/ThemeService";
import { ThemeCacheData } from "../../src/types/internal/ThemeCacheData";
import { viteConfig } from "../../src/viteconfig";

// Mock the vite import so that the environment variables can be controlled in tests
jest.mock("../../src/viteconfig", () => ({
  viteConfig: {
    DEFAULT_URL: "http://localhost:mock",
    DEFAULT_EXPIRATION: "60",
    CACHE_KEY_PREFIX: "VITE_THEME_CACHE_KEY_PREFIX",
  },
}));

// Create a mock for localStorage, using a closure to simulate localStorage behavior
const mockLocalStorage = (() => {
  let store: { [key: string]: string } = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    clear: () => {
      store = {};
    },
  };
})();

// Override the global window's localStorage with the mock version
Object.defineProperty(window, "localStorage", {
  value: mockLocalStorage,
});

/**
 * Tests for ThemeService.
 */
describe("ThemeService", () => {
  // Clears localStorage after each test to ensure isolation between tests
  afterEach(() => {
    localStorage.clear();
  });

  // Test that a theme can be cached and stored in localStorage correctly
  test("should cache a theme correctly", () => {
    const themeData: ThemeCacheData = {
      settings: {
        general: {
          primaryColor: 'blue',
        }
      },
      inlineStyles: {
        tooltipStyle: { backgroundColor: '#f0f0f0', padding: '10px', borderRadius: '5px' },
      },
      cssStylesText: ".example { color: red; }",
      cacheDate: Math.floor(Date.now() / 1000),
    };

    const id = "theme1";
    const version = "1.0";
    const cacheKey = `${viteConfig.CACHE_KEY_PREFIX}_${id}_${version}`;

    // Call setCachedTheme to save theme data into localStorage
    setCachedTheme(
      id,
      version,
      themeData.settings,
      themeData.inlineStyles,
      themeData.cssStylesText
    );

    // Verify that the theme was saved to localStorage using the correct cache key
    const cachedTheme = localStorage.getItem(cacheKey);
    expect(cachedTheme).not.toBeNull();
  });

  // Test that a cached theme can be retrieved before it expires
  test("should retrieve cached theme before expiration", () => {
    const themeData: ThemeCacheData = {
      settings: {},
      inlineStyles: {},
      cssStylesText: ".example { color: red; }",
      cacheDate: Math.floor(Date.now() / 1000),
    };

    const id = "theme1";
    const version = "1.0";
    const cacheDuration = 60;

    // Cache theme data for later retrieval
    setCachedTheme(
      id,
      version,
      themeData.settings,
      themeData.inlineStyles,
      themeData.cssStylesText
    );

    // Retrieve the cached theme using getCachedTheme and ensure it's not expired
    const cachedTheme = getCachedTheme(id, version, cacheDuration);
    expect(cachedTheme).not.toBeNull();
    expect(cachedTheme?.cssStylesText).toBe(themeData.cssStylesText);
  });

  // Test that invalid JSON in cache results in a null value when retrieved
  test("should handle invalid JSON in cache", () => {
    const id = "theme1";
    const version = "1.0";
    const cacheKey = `${viteConfig.CACHE_KEY_PREFIX}_${id}_${version}`;
  
    // Store invalid JSON in localStorage directly to simulate a corrupted cache
    localStorage.setItem(cacheKey, "invalid json");
  
    // Attempt to retrieve the corrupted cache and expect a null result
    const cachedTheme = getCachedTheme(id, version, 60);
    expect(cachedTheme).toBeNull();
  });
  
  // Test that caching a theme uses the correct cache key format
  test("should cache theme with the correct key", () => {
    const themeData: ThemeCacheData = {
      settings: {
        general: {
          primaryColor: 'blue',
        }
      },
      inlineStyles: {
        tooltipStyle: { backgroundColor: '#f0f0f0', padding: '10px', borderRadius: '5px' },
      },
      cssStylesText: ".example { color: red; }",
      cacheDate: Math.floor(Date.now() / 1000),
    };
  
    const id = "theme1";
    const version = "1.0";
    const cacheKey = `${viteConfig.CACHE_KEY_PREFIX}_${id}_${version}`;
  
    // Call setCachedTheme to save the theme data into localStorage
    setCachedTheme(
      id,
      version,
      themeData.settings,
      themeData.inlineStyles,
      themeData.cssStylesText
    );
  
    // Verify that the cached theme matches the original theme data as a JSON string
    const cachedTheme = localStorage.getItem(cacheKey);
    expect(cachedTheme).not.toBeNull();
    
    expect(cachedTheme).toBe(JSON.stringify(themeData)); 
  });
  
  // Test that caching themes with different versions uses separate cache keys
  test("should cache theme with different versions separately", () => {
    const themeDataV1: ThemeCacheData = {
      settings: {},
      inlineStyles: {},
      cssStylesText: ".example { color: red; }",
      cacheDate: Math.floor(Date.now() / 1000),
    };
  
    const themeDataV2: ThemeCacheData = {
      settings: {},
      inlineStyles: {},
      cssStylesText: ".example { color: blue; }",
      cacheDate: Math.floor(Date.now() / 1000),
    };
  
    const id = "theme1";
    const version1 = "1.0";
    const version2 = "2.0";
  
    // Cache two themes with different versions
    setCachedTheme(id, version1, themeDataV1.settings, themeDataV1.inlineStyles, themeDataV1.cssStylesText);
    setCachedTheme(id, version2, themeDataV2.settings, themeDataV2.inlineStyles, themeDataV2.cssStylesText);
  
    // Retrieve each version of the theme and ensure they are stored separately
    const cachedThemeV1 = getCachedTheme(id, version1, 60);
    const cachedThemeV2 = getCachedTheme(id, version2, 60);
  
    // Check that each version's CSS is stored correctly and they are different
    expect(cachedThemeV1?.cssStylesText).toBe(themeDataV1.cssStylesText);
    expect(cachedThemeV2?.cssStylesText).toBe(themeDataV2.cssStylesText);
    expect(cachedThemeV1?.cssStylesText).not.toBe(cachedThemeV2?.cssStylesText); // Ensure they are different
  });
  

});
