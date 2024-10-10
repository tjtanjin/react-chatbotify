import React from "react";

import { expect } from "@jest/globals";
import { render, screen} from "@testing-library/react";
import "@testing-library/jest-dom/jest-globals";

import ChatHistoryLineBreak from "../../../src/components/ChatHistoryLineBreak/ChatHistoryLineBreak";
import { useSettingsContext } from "../../../src/context/SettingsContext";
import { useStylesContext } from "../../../src/context/StylesContext";
import { DefaultStyles } from "../../../src/constants/internal/DefaultStyles";
import { DefaultSettings } from "../../../src/constants/internal/DefaultSettings";

jest.mock("../../../src/context/SettingsContext");
jest.mock("../../../src/context/StylesContext");

/**
 * Test for ChatHistoryLineBreak component.
 */
describe("ChatHistoryLineBreak Component", () => {
	const mockText = DefaultSettings.chatHistory?.chatHistoryLineBreakText ?? "test break line";
	const mockColor = DefaultStyles.chatHistoryLineBreakStyle?.color ?? "blue";
	
	// Mock default settings and styles before each test
	beforeEach(() => {
		(useSettingsContext as jest.Mock).mockReturnValue({
			settings: {
				chatHistory: {
					chatHistoryLineBreakText: mockText
				}
			}
		});

		(useStylesContext as jest.Mock).mockReturnValue({
			styles: {
				chatHistoryLineBreakStyle: {
					color: mockColor
				}
			}
		});
	});

	it("renders mock line break text and style", () => {
		render(<ChatHistoryLineBreak />);

		// check if the default text is rendered
		const lineBreak = screen.getByText(mockText);
		expect(lineBreak).toBeInTheDocument();

		// check if line break color is correct
		expect(lineBreak).toHaveStyle(`color: ${mockColor}`);
	});

	it("renders empty div when chatHistoryLineBreakText is not provided", () => {
		// Mock settings without chatHistoryLineBreakText
		(useSettingsContext as jest.Mock).mockReturnValue({
			settings: {
				chatHistory: {} // Simulate missing chatHistoryLineBreakText
			}
		});

		render(<ChatHistoryLineBreak />);

		// check that line break div exists but text is empty
		const lineBreak = screen.getByTestId("chat-history-line-break-text");
		expect(lineBreak).toBeInTheDocument();
		expect(lineBreak).toBeEmptyDOMElement();

		// check if line break color is applied even when chatHistoryLineBreakText is empty
		expect(lineBreak).toHaveStyle(`color: ${DefaultStyles.chatHistoryLineBreakStyle?.color ?? mockColor}`);
	});

	it("renders empty when chatHistory is not provided", () => {
		(useSettingsContext as jest.Mock).mockReturnValue({
			settings: {}
		});

		render(<ChatHistoryLineBreak />);

		// check that line break div exists but text is empty
		const lineBreak = screen.getByTestId("chat-history-line-break-text");
		expect(lineBreak).toBeInTheDocument();
		expect(lineBreak).toBeEmptyDOMElement();

		// check line break color is applied even when chatHistory is empty
		expect(lineBreak).toHaveStyle(`color: ${DefaultStyles.chatHistoryLineBreakStyle?.color ?? mockColor}`);
	});
});
