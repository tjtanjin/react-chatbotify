import React from "react";
import { render, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import ChatBotLoader from "../../src/components/ChatBotLoader";
import { useBotRefsContext } from "../../src/context/BotRefsContext";
import { useBotStatesContext } from "../../src/context/BotStatesContext";
import { useSettingsContext } from "../../src/context/SettingsContext";
import { useStylesContext } from "../../src/context/StylesContext";
import { useChatBotContext } from "../../src/context/ChatBotContext";
import { Flow } from "../../src/types/Flow";
import { emitRcbEvent } from "../../src/services/RcbEventService";
import { RcbEvent } from "../../src/constants/RcbEvent";

jest.mock("../../src/context/BotRefsContext");
jest.mock("../../src/context/BotStatesContext");
jest.mock("../../src/context/SettingsContext");
jest.mock("../../src/context/StylesContext");
jest.mock("../../src/context/ChatBotContext");
jest.mock("../../src/services/RcbEventService", () => ({
	emitRcbEvent: jest.fn().mockReturnValue({ defaultPrevented: false }),
}));
jest.mock("../../src/viteconfig", () => ({
	viteConfig: {
		DEFAULT_URL: "http://localhost:mock",
		DEFAULT_EXPIRATION: "60",
		CACHE_KEY_PREFIX: "VITE_THEME_CACHE_KEY_PREFIX",
	},
}));

const mockId = "test-bot";
const mockFlow: Flow = {
	block1: {
		message: "Hello! This is a sample message.",
		options: ["Option 1", "Option 2"],
		isSensitive: false,
	},
	block2: {
		message: (params) => `Message with user input: ${params.userInput}`,
		transition: { duration: 500, interruptable: true },
	},
};
const mockSettings = { event: { rcbPreLoadChatBot: true, rcbPostLoadChatBot: true } };
const mockStyles = {}; 
const mockThemes = [{ id: 'theme1' }];
const mockPlugins = [
	() => ({
		name: "plugin1",
		settings: mockSettings,
		styles: mockStyles,
	}),
];
const mockSetConfigLoaded = jest.fn();
const mockStyleRootRef = { current: null };
const mockChatBotContext = { loadConfig: jest.fn() };

const renderChatBotLoader = () => {
	return render(
		<ChatBotLoader
			id={mockId}
			flow={mockFlow}
			settings={mockSettings}
			styles={mockStyles}
			themes={mockThemes}
			plugins={mockPlugins}
			setConfigLoaded={mockSetConfigLoaded}
			styleRootRef={mockStyleRootRef}
		/>
	);
};

describe("ChatBotLoader Component", () => {
	beforeEach(() => {
		jest.clearAllMocks();
		(useBotRefsContext as jest.Mock).mockReturnValue({ flowRef: { current: null } });
		(useBotStatesContext as jest.Mock).mockReturnValue({
			hasFlowStarted: false,
			setHasFlowStarted: jest.fn(),
			setUnreadCount: jest.fn(),
			setTextAreaDisabled: jest.fn(),
			setIsChatWindowOpen: jest.fn(),
			setAudioToggledOn: jest.fn(),
		});
		(useSettingsContext as jest.Mock).mockReturnValue({
			settings: {
				general: {
					showHeader: true,
					desktopEnabled: true,
					mobileEnabled: true,
				},
			},
		});
		(useStylesContext as jest.Mock).mockReturnValue({
			styles: { loaderStyle: { background: "gray", color: "white" } },
		});
		(useChatBotContext as jest.Mock).mockReturnValue(mockChatBotContext);
	});

	it("updates flowRef with the provided flow", () => {
		const mockFlowRef = { current: null };
		(useBotRefsContext as jest.Mock).mockReturnValue({ flowRef: mockFlowRef });
		renderChatBotLoader();
		expect(mockFlowRef.current).toBe(mockFlow);
	});

	it("emits pre-load event if rcbPreLoadChatBot is set in settings", () => {
		renderChatBotLoader();
		expect(emitRcbEvent).toHaveBeenCalledWith(
			RcbEvent.PRE_LOAD_CHATBOT,
			{ botId: mockId, currPath: null, prevPath: null },
			{ flow: mockFlow, settings: mockSettings, styles: mockStyles, themes: mockThemes, plugins: mockPlugins }
		);
	});

	it("loads configuration when themes change", async () => {
		renderChatBotLoader();
		mockThemes.push({ id: 'theme2' }); // Simulate theme change
		await waitFor(() => expect(mockChatBotContext.loadConfig).toHaveBeenCalledTimes(1));
	});

	it("emits post-load event if rcbPostLoadChatBot is set in settings", async () => {
		renderChatBotLoader();
		await waitFor(() => {
			expect(emitRcbEvent).toHaveBeenCalledWith(
				RcbEvent.POST_LOAD_CHATBOT,
				{ botId: mockId, currPath: null, prevPath: null },
				{ flow: mockFlow, settings: mockSettings, styles: mockStyles, themes: mockThemes, plugins: mockPlugins }
			);
		});
	});
});
