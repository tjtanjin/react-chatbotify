import React from "react";

import { expect } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/jest-globals";

import ChatBotContainer from "../../src/components/ChatBotContainer";
import { useButtonInternal } from "../../src/hooks/internal/useButtonsInternal";
import { useChatWindowInternal } from "../../src/hooks/internal/useChatWindowInternal";
import { useIsDesktopInternal } from "../../src/hooks/internal/useIsDesktopInternal";
import { useBotStatesContext } from "../../src/context/BotStatesContext";
import { useSettingsContext } from "../../src/context/SettingsContext";
import { useStylesContext } from "../../src/context/StylesContext";
import { useBotRefsContext } from "../../src/context/BotRefsContext";
import { useNotificationInternal } from "../../src/hooks/internal/useNotificationsInternal"; 

jest.mock("../../src/hooks/internal/useButtonsInternal");
jest.mock("../../src/hooks/internal/useChatWindowInternal");
jest.mock("../../src/hooks/internal/useIsDesktopInternal");
jest.mock("../../src/context/BotStatesContext");
jest.mock("../../src/context/SettingsContext");
jest.mock("../../src/context/StylesContext");
jest.mock("../../src/context/BotRefsContext");
jest.mock("../../src/hooks/internal/useNotificationsInternal");
jest.mock("../../src/viteconfig", () => ({
	viteConfig: {
		DEFAULT_URL: "http://localhost:mock",
		DEFAULT_EXPIRATION: "60",
		CACHE_KEY_PREFIX: "VITE_THEME_CACHE_KEY_PREFIX",
	},
}));

describe("ChatBotContainer Component", () => {
	beforeEach(() => {
		(useButtonInternal as jest.Mock).mockReturnValue({
			headerButtons: [<button key="header-btn">Header Button</button>],
			chatInputButtons: [<button key="input-btn">Input Button</button>],
			footerButtons: [<button key="footer-btn">Footer Button</button>],
		});

		(useChatWindowInternal as jest.Mock).mockReturnValue({
			isChatWindowOpen: true,
			chatScrollHeight: 100,
			viewportHeight: 600,
			viewportWidth: 300,
			setChatScrollHeight: jest.fn(),
		});

		(useIsDesktopInternal as jest.Mock).mockReturnValue(true);

		(useBotStatesContext as jest.Mock).mockReturnValue({
			hasFlowStarted: false,
			setHasFlowStarted: jest.fn(),
			setUnreadCount: jest.fn(),
			setTextAreaDisabled: jest.fn(), 
			setIsChatWindowOpen: jest.fn(),
			setAudioToggledOn: jest.fn(),
		});

		(useStylesContext as jest.Mock).mockReturnValue({
			styles: {
				chatWindowStyle: { background: 'white', color: 'black' },
			},
		});

		(useBotRefsContext as jest.Mock).mockReturnValue({
			flowRef: { current: {} },
			chatBodyRef: { current: document.createElement('div') },
			streamMessageMap: new Map(),
			paramsInputRef: { current: null },
			keepVoiceOnRef: { current: false },
		});

		(useNotificationInternal as jest.Mock).mockReturnValue({
			audioContextRef: { current: {} },
			setUpNotifications: jest.fn(),
		});
	});

	it("renders ChatBotContainer with header, body, input, and footer", () => {
		(useSettingsContext as jest.Mock).mockReturnValue({
			settings: {
				general: {
					showHeader: true, 
					showInputRow: true,
					showFooter: true,
					flowStartTrigger: "ON_CHATBOT_INTERACT",
				},
				device: { desktopEnabled: true, mobileEnabled: true },
			},
		});
		render(<ChatBotContainer />);

		const headerButton = screen.getByText("Header Button");
		const inputButton = screen.getByText("Input Button");
		const footerButton = screen.getByText("Footer Button");

		expect(headerButton).toBeInTheDocument();
		expect(inputButton).toBeInTheDocument();
		expect(footerButton).toBeInTheDocument();
	});

	it("renders header when settings.general.showHeader is true", () => {
		(useSettingsContext as jest.Mock).mockReturnValue({
			settings: {
				general: {
					showHeader: true, 
					showInputRow: false,
					showFooter: false,
					flowStartTrigger: "ON_CHATBOT_INTERACT",
				},
				device: { desktopEnabled: true, mobileEnabled: true },
			},
		});
		render(<ChatBotContainer />);

		expect(screen.queryByText("Header Button")).toBeInTheDocument();
		expect(screen.queryByText("Input Button")).not.toBeInTheDocument();
		expect(screen.queryByText("Footer Button")).not.toBeInTheDocument();
	});

	it("renders input button when settings.general.showInputRow is true", () => {
		(useSettingsContext as jest.Mock).mockReturnValue({
			settings: {
				general: {
					showHeader: false, 
					showInputRow: true,
					showFooter: false,
					flowStartTrigger: "ON_CHATBOT_INTERACT",
				},
				device: { desktopEnabled: true, mobileEnabled: true },
			},
		});
		
		render(<ChatBotContainer />);
	
		expect(screen.queryByText("Input Button")).toBeInTheDocument();
		expect(screen.queryByText("Header Button")).not.toBeInTheDocument();
		expect(screen.queryByText("Footer Button")).not.toBeInTheDocument();
	});

	it("renders footer button when settings.general.showFooter is true", () => {
		(useSettingsContext as jest.Mock).mockReturnValue({
			settings: {
				general: {
					showHeader: false, 
					showInputRow: false,
					showFooter: true,
					flowStartTrigger: "ON_CHATBOT_INTERACT",
				},
				device: { desktopEnabled: true, mobileEnabled: true },
			},
		});
		
		render(<ChatBotContainer />);
	
		expect(screen.queryByText("Footer Button")).toBeInTheDocument();
		expect(screen.queryByText("Header Button")).not.toBeInTheDocument();
		expect(screen.queryByText("Input Button")).not.toBeInTheDocument();
	});	

	it("sets flow started on mouse down if it hasn't started", () => {
		const setHasFlowStarted = jest.fn(); // Mock function for setHasFlowStarted
		const setUnreadCount = jest.fn(); // Mock function for setUnreadCount
		const setTextAreaDisabled = jest.fn(); // Mock function for setTextAreaDisabled
		const setIsChatWindowOpen = jest.fn(); // Mock function for setIsChatWindowOpen
		const setAudioToggledOn = jest.fn(); // Mock function for setAudioToggledOn

		(useSettingsContext as jest.Mock).mockReturnValue({
			settings: {
				general: {
					showHeader: true, 
					showInputRow: true,
					showFooter: true,
					flowStartTrigger: "ON_CHATBOT_INTERACT",
				},
				device: { desktopEnabled: true, mobileEnabled: true },
			},
		});

		(useBotStatesContext as jest.Mock).mockReturnValue({
			hasFlowStarted: false,
			setHasFlowStarted,
			setUnreadCount,
			setTextAreaDisabled,
			setIsChatWindowOpen,
			setAudioToggledOn,
			// Add other necessary mock return values here
		});

		render(<ChatBotContainer />);
        
		// Use 'textbox' role instead of 'dialog'
		const chatInput = screen.getByRole('textbox', { name: 'input text area' });
		chatInput.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));

		// Check that setHasFlowStarted was called with true
		expect(setHasFlowStarted).toHaveBeenCalledWith(true);
	});

	it("does not render chatbot when shouldShowChatBot is false", () => {
		(useIsDesktopInternal as jest.Mock).mockReturnValue(false);
		(useSettingsContext as jest.Mock).mockReturnValue({
			settings: {
				general: {
					showHeader: false, 
					showInputRow: false,
					showFooter: false,
					flowStartTrigger: "ON_CHATBOT_INTERACT",
				},
				device: { desktopEnabled: true, mobileEnabled: true },
			},
		});
		render(<ChatBotContainer />);
		
		expect(screen.queryByText("Header Button")).not.toBeInTheDocument();
	});
});
