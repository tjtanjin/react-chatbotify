import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import ChatBotContainer from "../../../src/components/ChatBotContainer";
import { useButtonInternal } from "../../../src/hooks/internal/useButtonsInternal";
import { useChatWindowInternal } from "../../../src/hooks/internal/useChatWindowInternal";
import { useIsDesktopInternal } from "../../../src/hooks/internal/useIsDesktopInternal";
import { useBotStatesContext } from "../../../src/context/BotStatesContext";
import { useSettingsContext } from "../../../src/context/SettingsContext";
import { useStylesContext } from "../../../src/context/StylesContext";
import { useBotRefsContext } from "../../../src/context/BotRefsContext";

// Mocking necessary hooks and context providers
jest.mock("../../../src/hooks/internal/useButtonsInternal");
jest.mock("../../../src/hooks/internal/useChatWindowInternal");
jest.mock("../../../src/hooks/internal/useIsDesktopInternal");
jest.mock("../../../src/context/BotStatesContext");
jest.mock("../../../src/context/SettingsContext");
jest.mock("../../../src/context/StylesContext");
jest.mock("../../../src/context/BotRefsContext");

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
		});

		(useSettingsContext as jest.Mock).mockReturnValue({
			settings: {
				general: {
					showHeader: true,
					showFooter: true,
					showInputRow: true,
					flowStartTrigger: "ON_CHATBOT_INTERACT",
					desktopEnabled: true,
					mobileEnabled: true,
				},
			},
		});

		(useStylesContext as jest.Mock).mockReturnValue({
			styles: {
				chatWindowStyle: { background: 'white', color: 'black' },
			},
		});

		(useBotRefsContext as jest.Mock).mockReturnValue({
			flowRef: { current: {} },  // Mocked flowRef
			chatBodyRef: { current: document.createElement('div') },
			streamMessageMap: new Map(),
			paramsInputRef: { current: null },
			keepVoiceOnRef: { current: false },
		});
	});

	it("renders ChatBotContainer with header, body, input, and footer", () => {
		render(<ChatBotContainer />);

		// Check if the header, body, input, and footer components are rendered
		const headerButton = screen.getByText("Header Button");
		const inputButton = screen.getByText("Input Button");
		const footerButton = screen.getByText("Footer Button");

		expect(headerButton).toBeInTheDocument();
		expect(inputButton).toBeInTheDocument();
		expect(footerButton).toBeInTheDocument();
	});
});
