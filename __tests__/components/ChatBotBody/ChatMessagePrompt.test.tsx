import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import ChatMessagePrompt from "../../../src/components/ChatBotBody/ChatMessagePrompt/ChatMessagePrompt";
import { useBotStatesContext } from "../../../src/context/BotStatesContext";

// Mock contexts
jest.mock("../../../src/context/BotRefsContext", () => ({
	useBotRefsContext: jest.fn(() => ({
		chatBodyRef: {
			current: {
				scrollTop: 0,
				scrollHeight: 1000,
				clientHeight: 400,
			},
		},
	})),
}));

jest.mock("../../../src/context/BotStatesContext", () => ({
	useBotStatesContext: jest.fn(),
}));

jest.mock("../../../src/context/SettingsContext", () => ({
	useSettingsContext: jest.fn(() => ({
		settings: {
			general: { primaryColor: "#000" },
			chatWindow: {
				showMessagePrompt: true,
				messagePromptText: "Scroll to new messages",
			},
		},
	})),
}));

jest.mock("../../../src/context/StylesContext", () => ({
	useStylesContext: jest.fn(() => ({
		styles: {
			chatMessagePromptStyle: { color: "#fff", borderColor: "#ccc" },
			chatMessagePromptHoveredStyle: { color: "#000", borderColor: "#000" },
		},
	})),
}));

describe("ChatMessagePrompt Component", () => {
	const mockSetIsScrolling = jest.fn();

	beforeEach(() => {
		jest.clearAllMocks();
		jest.useFakeTimers();
	});

	afterEach(() => {
		jest.runOnlyPendingTimers();
		jest.useRealTimers();
	});

	const renderComponent = () => render(<ChatMessagePrompt />);

	it("renders with the correct message prompt text", () => {
		(useBotStatesContext as jest.Mock).mockReturnValue({
			unreadCount: 0,
			isScrolling: false,
			setIsScrolling: mockSetIsScrolling,
		});

		renderComponent();
		const messagePrompt = screen.getByText("Scroll to new messages");
		expect(messagePrompt).toBeInTheDocument();
	});

	it("applies visible class when conditions are met", () => {
		(useBotStatesContext as jest.Mock).mockReturnValue({
			unreadCount: 2,
			isScrolling: true,
			setIsScrolling: mockSetIsScrolling,
		});

		renderComponent();
		const messagePrompt = screen.getByText("Scroll to new messages");
		expect(messagePrompt.parentElement).toHaveClass("rcb-message-prompt-container visible");
	});

	it("applies hidden class when conditions are not met", () => {
		(useBotStatesContext as jest.Mock).mockReturnValue({
			unreadCount: 0,
			isScrolling: false,
			setIsScrolling: mockSetIsScrolling,
		});

		renderComponent();
		const messagePromptContainer = screen.queryByText("Scroll to new messages")?.parentElement;
		expect(messagePromptContainer).toHaveClass("rcb-message-prompt-container hidden");
	});

	it("applies hover styles when hovered", () => {
		(useBotStatesContext as jest.Mock).mockReturnValue({
			unreadCount: 2,
			isScrolling: true,
			setIsScrolling: mockSetIsScrolling,
		});

		renderComponent();
		const messagePrompt = screen.getByText("Scroll to new messages");

		// Before hover
		expect(messagePrompt).toHaveStyle({ color: "#fff", borderColor: "#ccc" });

		// Hover
		fireEvent.mouseEnter(messagePrompt);
		expect(messagePrompt).toHaveStyle({ color: "#000", borderColor: "#000" });

		// Leave hover
		fireEvent.mouseLeave(messagePrompt);
		expect(messagePrompt).toHaveStyle({ color: "#fff", borderColor: "#ccc" });
	});

	it("scrolls to the bottom when clicked", () => {
		(useBotStatesContext as jest.Mock).mockReturnValue({
			unreadCount: 2,
			isScrolling: true,
			setIsScrolling: mockSetIsScrolling,
		});

		renderComponent();
		const messagePrompt = screen.getByText("Scroll to new messages");

		fireEvent.mouseDown(messagePrompt);

		// Simulate scrolling completion
		jest.advanceTimersByTime(600);

		// Verify that setIsScrolling was called
		expect(mockSetIsScrolling).toHaveBeenCalledWith(false);
	});
});
