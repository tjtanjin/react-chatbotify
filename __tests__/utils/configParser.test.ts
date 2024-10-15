import {
  parseConfig,
  getDefaultSettings,
  getDefaultStyles,
} from "../../src/utils/configParser";
import { processAndFetchThemeConfig } from "../../src/services/ThemeService";
import { Settings } from "../../src/types/Settings";
import { Styles } from "../../src/types/Styles";
import { Theme } from "../../src/types/Theme";
import { DefaultSettings } from "../../src/constants/internal/DefaultSettings";
import { DefaultStyles } from "../../src/constants/internal/DefaultStyles";

jest.mock("../../src/services/ThemeService", () => ({
  processAndFetchThemeConfig: jest.fn(),
}));

const mockedProcessAndFetchThemeConfig =
  processAndFetchThemeConfig as jest.MockedFunction<
    typeof processAndFetchThemeConfig
  >;

describe("parseConfig", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return default settings correctly", () => {
    const defaultSettings = getDefaultSettings();
    expect(defaultSettings).toEqual(DefaultSettings);
  });

  it("should return default styles correctly", () => {
    const defaultStyles = getDefaultStyles();
    expect(defaultStyles).toEqual(DefaultStyles);
  });

  it("should parse the config correctly without themes or provided settings/styles", async () => {
    const botId = "bot123";
    const providedSettings = undefined;
    const providedStyles = undefined;
    const themes = undefined;

    const result = await parseConfig(
      botId,
      providedSettings,
      providedStyles,
      themes
    );

    expect(result.settings).toEqual(getDefaultSettings());
    expect(result.inlineStyles).toEqual(getDefaultStyles());
    expect(result.cssStylesText).toBe("");
  });

  it("should parse the config correctly with a theme array", async () => {
    const botId = "bot123";
    const providedSettings = undefined;
    const providedStyles = undefined;
    const themes: Theme[] = [{ id: "theme1" }, { id: "theme2" }];

    mockedProcessAndFetchThemeConfig.mockResolvedValueOnce({
      settings: { chatInput: { botDelay: 1000 } },
      inlineStyles: { bodyStyle: { backgroundColor: "#fff" } },
      cssStylesText: "theme1-css",
    });

    mockedProcessAndFetchThemeConfig.mockResolvedValueOnce({
      settings: { chatInput: { botDelay: 2000 } },
      inlineStyles: { bodyStyle: { color: "#000" } },
      cssStylesText: "theme2-css",
    });

    const result = await parseConfig(
      botId,
      providedSettings,
      providedStyles,
      themes
    );

    expect(mockedProcessAndFetchThemeConfig).toHaveBeenCalledTimes(2);
    expect(result.settings.chatInput?.botDelay).toBe(2000);
    expect(result.inlineStyles.bodyStyle?.color).toBe("#000");
    expect(result.cssStylesText).toBe("theme1-csstheme2-css");
  });

  it("should parse the config correctly with provided settings and styles", async () => {
    const botId = "bot123";
    const providedSettings: Settings = {
      chatInput: { botDelay: 300 },
    };
    const providedStyles: Styles = {
      bodyStyle: { color: "blue" },
    };
    const themes = undefined;

    const result = await parseConfig(
      botId,
      providedSettings,
      providedStyles,
      themes
    );

    expect(result.settings.chatInput?.botDelay).toBe(500);
    expect(result.inlineStyles.bodyStyle?.color).toBe("blue");
    expect(result.cssStylesText).toBe("");
  });

  it("should parse the config correctly with a single theme", async () => {
    const botId = "bot123";
    const providedSettings = undefined;
    const providedStyles = undefined;
    const theme: Theme = { id: "theme1" };

    mockedProcessAndFetchThemeConfig.mockResolvedValue({
      settings: { chatInput: { botDelay: 1500 } },
      inlineStyles: { bodyStyle: { backgroundColor: "#123456" } },
      cssStylesText: "theme1-css",
    });

    const result = await parseConfig(
      botId,
      providedSettings,
      providedStyles,
      theme
    );

    expect(mockedProcessAndFetchThemeConfig).toHaveBeenCalledTimes(1);
    expect(result.settings.chatInput?.botDelay).toBe(1500);
    expect(result.inlineStyles.bodyStyle?.backgroundColor).toBe("#123456");
    expect(result.cssStylesText).toBe("theme1-css");
  });
});
