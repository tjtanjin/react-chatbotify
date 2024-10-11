import React from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { useSettingsContext } from "../../../src/context/SettingsContext";
import { useStylesContext } from "../../../src/context/StylesContext";
import ChatHistoryButton from "../../../src/components/ChatHistoryButton/ChatHistoryButton"
import { useChatHistoryInternal } from "../../../src/hooks/internal/useChatHistoryInternal";

// Mock the contexts and hook
jest.mock("../../../src/context/SettingsContext", () => ({
	useSettingsContext: jest.fn(),
}));

jest.mock("../../../src/context/StylesContext", () => ({
	useStylesContext: jest.fn(),
}));

jest.mock("../../../src/hooks/internal/useChatHistoryInternal", () => ({
	useChatHistoryInternal: jest.fn(),
}));


describe("ChatHistoryButton", () => {
	const mockSettings = {
		general: { primaryColor: "#000000" },
		chatHistory: { viewChatHistoryButtonText: "View History" },
	};

	const mockStyles = {
		chatHistoryButtonStyle: { backgroundColor: "#ffffff", border: "1px solid", borderColor: "#ccc" },
		chatHistoryButtonHoveredStyle: { backgroundColor: "#f0f0f0" },
	};

	const mockShowChatHistory = jest.fn();

	beforeEach(() => {
		// Mock context values
		(useSettingsContext as jest.Mock).mockReturnValue({ settings: mockSettings });
		(useStylesContext as jest.Mock).mockReturnValue({ styles: mockStyles });
		(useChatHistoryInternal as jest.Mock).mockReturnValue({ showChatHistory: mockShowChatHistory });
	});

	it("renders the chat history button with correct text and styles", () => {
		render(<ChatHistoryButton />);

		// Verify the button text
		expect(screen.getByText("View History")).toBeInTheDocument();

		// Verify the button's initial styles
		const button = screen.getByRole("button");
		expect(button).toHaveStyle("background-color: #ffffff");
		expect(button).toHaveStyle("border: 1px solid; border-color: #ccc");
	});

	it("changes styles when hovered", () => {
		render(<ChatHistoryButton />);

		const button = screen.getByRole("button");

		// Simulate hover
		fireEvent.mouseEnter(button);
		expect(button).toHaveStyle("background-color: #f0f0f0");

		// Simulate mouse leave
		fireEvent.mouseLeave(button);
		expect(button).toHaveStyle("background-color: #ffffff");
	});

	it("calls showChatHistory when clicked", () => {
		render(<ChatHistoryButton />);

		const button = screen.getByRole("button");

		// Simulate button click
		fireEvent.mouseDown(button);

		// Verify showChatHistory is called
		expect(mockShowChatHistory).toHaveBeenCalledTimes(1);
	});
});
