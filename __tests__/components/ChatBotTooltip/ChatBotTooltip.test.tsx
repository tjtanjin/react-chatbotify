import React from "react";
import "@testing-library/jest-dom"; 
import { render, screen, fireEvent } from "@testing-library/react";
import ChatBotTooltip from "../../../src/components/ChatBotTooltip/ChatBotTooltip";
import { useIsDesktopInternal } from "../../../src/hooks/internal/useIsDesktopInternal";
import { useChatWindowInternal } from "../../../src/hooks/internal/useChatWindowInternal";
import { useSettingsContext } from "../../../src/context/SettingsContext";
import { useStylesContext } from "../../../src/context/StylesContext";

// Mock the dependencies to isolate the component under test
jest.mock("../../../src/hooks/internal/useIsDesktopInternal");
jest.mock("../../../src/hooks/internal/useChatWindowInternal");
jest.mock("../../../src/context/SettingsContext");
jest.mock("../../../src/context/StylesContext");

describe("ChatBotTooltip Component", () => {
	// Set up default mock return values before each test
	beforeEach(() => {
		(useIsDesktopInternal as jest.Mock).mockReturnValue(true); // Assume desktop for all tests
		(useChatWindowInternal as jest.Mock).mockReturnValue({
			isChatWindowOpen: false,
			openChat: jest.fn(), // Mock the openChat function
		});
		(useSettingsContext as jest.Mock).mockReturnValue({
			settings: {
				general: { primaryColor: "blue", secondaryColor: "#000", embedded: false },
				tooltip: { text: "Chatbot Tooltip" }, // Default tooltip text
			},
		});
		(useStylesContext as jest.Mock).mockReturnValue({
			styles: {
				chatButtonStyle: { width: 75 },
				chatWindowStyle: { width: 375 },
				tooltipStyle: {}, // Default styles
			},
		});
	}); 

	// Clear all mocks after each test case to avoid test interference
	afterEach(() => {
		jest.clearAllMocks();
	});

	// Test: Render the tooltip when mode is "ALWAYS" and on desktop
	it('renders tooltip when mode is "ALWAYS" and isDesktop is true', () => {
		(useSettingsContext as jest.Mock).mockReturnValueOnce({
			settings: {
				tooltip: { mode: "ALWAYS", text: "Chatbot Tooltip" },
			},
		});

		render(<ChatBotTooltip />);
		const tooltip = screen.getByText("Chatbot Tooltip");
		expect(tooltip).toBeInTheDocument(); // Ensure tooltip is rendered
		expect(tooltip).toHaveClass("rcb-tooltip-show"); // Ensure tooltip is visible
	});

	// Test: Ensure the tooltip is hidden when mode is "NEVER"
	it('hides tooltip when mode is "NEVER"', () => {
		(useSettingsContext as jest.Mock).mockReturnValueOnce({
			settings: {
				tooltip: { mode: "NEVER", text: "Chatbot Tooltip" },
			},
		});

		render(<ChatBotTooltip />);
		const tooltip = screen.queryByText("Chatbot Tooltip");
		expect(tooltip).not.toBeInTheDocument(); // Tooltip should not be in the document
	});

	// Test: Show the tooltip when mode is "START" and it hasn't been shown yet
	it('shows tooltip when mode is "START" and shownTooltipOnStart is false', () => {
		(useSettingsContext as jest.Mock).mockReturnValueOnce({
			settings: {
				tooltip: { mode: "START", text: "Chatbot Tooltip" },
			},
		});

		render(<ChatBotTooltip />);
		const tooltip = screen.getByText("Chatbot Tooltip");
		expect(tooltip).toBeInTheDocument(); // Ensure tooltip is rendered
	});

	// Test: Ensure the tooltip shows when mode is "CLOSE" and the chat window is closed
	it('shows tooltip when mode is "CLOSE" and isChatWindowOpen is false', () => {
		(useSettingsContext as jest.Mock).mockReturnValueOnce({
			settings: {
				tooltip: { mode: "CLOSE", text: "Chatbot Tooltip" },
			},
		});

		render(<ChatBotTooltip />);
		const tooltip = screen.getByText("Chatbot Tooltip");
		expect(tooltip).toBeInTheDocument(); // Ensure tooltip is rendered
	});

	// Test: Ensure clicking the tooltip calls the openChat function
	it("calls openChat function when tooltip is clicked", () => {
		const mockOpenChat = jest.fn();
		(useChatWindowInternal as jest.Mock).mockReturnValue({
			isChatWindowOpen: false,
			openChat: mockOpenChat,
		});

		render(<ChatBotTooltip />);
		const tooltip = screen.getByText("Chatbot Tooltip");
		fireEvent.click(tooltip); // Simulate clicking the tooltip
		expect(mockOpenChat).toHaveBeenCalledWith(true); // Ensure openChat was called with true
	});
});
