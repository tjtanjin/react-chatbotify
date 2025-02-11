import React from "react";

import { render, screen } from "@testing-library/react";
import { expect } from "@jest/globals";
import "@testing-library/jest-dom/jest-globals";

import ChatBot from "../../src/components/ChatBot";

import { WelcomeFlow } from "../../src/constants/internal/WelcomeFlow";

import { useChatBotContext } from "../../src/context/ChatBotContext";

import { Settings } from "../../src/types/Settings";
import { Styles } from "../../src/types/Styles";
import { Theme } from "../../src/types/Theme";

// Mock dependencies
jest.mock("../../src/utils/idGenerator", () => ({
	generateSecureUUID: jest.fn(() => "mocked-uuid"),
}));

jest.mock("../../src/context/ChatBotContext", () => ({
	useChatBotContext: jest.fn(),
	ChatBotProvider: ({ children }: { children: React.ReactNode }) => (
		<div>{children}</div>
	),
}));

jest.mock("../../src/components/ChatBotLoader", () => () => (
	<div data-testid="chatbot-loader" />
));

jest.mock("../../src/components/ChatBotContainer", () => () => (
	<div data-testid="chatbot-container" />
));

describe("ChatBot Component", () => {
	it("renders ChatBot with default settings when no props are provided", () => {
		render(<ChatBot />);

		// Check if ChatBotLoader is rendered with default settings
		expect(screen.getByTestId("chatbot-loader")).toBeInTheDocument();
		expect(screen.queryByTestId("chatbot-container")).not.toBeInTheDocument();
	});

	it("renders ChatBot with provided settings", () => {
		const customFlow = { ...WelcomeFlow };
		const customSettings: Settings = {
			/* provide valid properties for Settings type */
		};
		const customStyles: Styles = {
			/* provide valid properties for Styles type */
		};
		const customThemes: Theme[] = [
			/* provide valid properties for Theme type */
		];
		const customPlugins: [] = [];

		render(
			<ChatBot
				id="custom-id"
				flow={customFlow}
				settings={customSettings}
				styles={customStyles}
				themes={customThemes}
				plugins={customPlugins}
			/>
		);

		// Check if ChatBotLoader is rendered with provided settings
		expect(screen.getByTestId("chatbot-loader")).toBeInTheDocument();
		expect(screen.queryByTestId("chatbot-container")).not.toBeInTheDocument();
	});
	it("renders ChatBot with ChatBotProvider when context is not provided", () => {
		render(<ChatBot />);

		// Check if ChatBotProvider is rendered
		expect(screen.getByTestId("chatbot-loader")).toBeInTheDocument();
	});

	// useChatBotContext is already imported at the top
	(useChatBotContext as jest.Mock).mockReturnValue({});

	it("renders ChatBot without ChatBotProvider when context is provided", () => {
		render(<ChatBot />);

		// Check if ChatBotProvider is not rendered
		expect(screen.getByTestId("chatbot-loader")).toBeInTheDocument();
	});
});
