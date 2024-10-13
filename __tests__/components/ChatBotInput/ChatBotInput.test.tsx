import React from "react";
import { expect } from "@jest/globals";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/jest-globals";

import ChatBotInput from "../../../src/components/ChatBotInput/ChatBotInput";
import { useSubmitInputInternal } from "../../../src/hooks/internal/useSubmitInputInternal";
import { useIsDesktopInternal } from "../../../src/hooks/internal/useIsDesktopInternal";
import { useTextAreaInternal } from "../../../src/hooks/internal/useTextAreaInternal";
import { useBotStatesContext } from "../../../src/context/BotStatesContext";
import { useBotRefsContext } from "../../../src/context/BotRefsContext";
import { useSettingsContext } from "../../../src/context/SettingsContext";
import { useStylesContext } from "../../../src/context/StylesContext";

// Mock the hooks and contexts
jest.mock("../../../src/hooks/internal/useSubmitInputInternal");
jest.mock("../../../src/hooks/internal/useIsDesktopInternal");
jest.mock("../../../src/hooks/internal/useTextAreaInternal");
jest.mock("../../../src/context/BotStatesContext");
jest.mock("../../../src/context/BotRefsContext");
jest.mock("../../../src/context/SettingsContext");
jest.mock("../../../src/context/StylesContext");

describe("ChatBotInput", () => {
	const defaultProps = {
		buttons: [<button key="1">Button 1</button>, <button key="2">Button 2</button>],
	};

	const handleSubmitTextMock = jest.fn();
	const setTextAreaValueMock = jest.fn();
	const setHasFlowStartedMock = jest.fn();
	const setInputLengthMock = jest.fn();

	beforeEach(() => {
		// Mock context values
		(useSubmitInputInternal as jest.Mock).mockReturnValue({ handleSubmitText: handleSubmitTextMock });
		(useIsDesktopInternal as jest.Mock).mockReturnValue(true);
		(useTextAreaInternal as jest.Mock).mockReturnValue({ setTextAreaValue: setTextAreaValueMock });
		(useBotStatesContext as jest.Mock).mockReturnValue({
			textAreaDisabled: false,
			textAreaSensitiveMode: false,
			inputLength: 0,
			hasFlowStarted: false,
			setHasFlowStarted: setHasFlowStartedMock,
			setInputLength: setInputLengthMock,
		});
		(useBotRefsContext as jest.Mock).mockReturnValue({
			inputRef: { current: { value: "" } },
		});
		(useSettingsContext as jest.Mock).mockReturnValue({
			settings: {
				general: {
					primaryColor: "blue",
					actionDisabledIcon: "disabled-icon-url",
					flowStartTrigger: "ON_CHATBOT_INTERACT",
				},
				chatInput: {
					enabledPlaceholderText: "Type your message...",
					disabledPlaceholderText: "Input disabled",
					allowNewline: false,
					showCharacterCount: true,
					characterLimit: 100,
				},
				sensitiveInput: {
					maskInTextArea: false,
				},
				ariaLabel: {
					inputTextArea: "Chat input",
				},
			},
		});
		(useStylesContext as jest.Mock).mockReturnValue({
			styles: {
				chatInputAreaStyle: { backgroundColor: "white" },
				chatInputAreaFocusedStyle: { borderColor: "blue" },
				chatInputAreaDisabledStyle: { backgroundColor: "grey" },
				characterLimitStyle: { color: "black" },
				characterLimitReachedStyle: { color: "red" },
			},
		});
	});

	it("renders the input field and buttons correctly", () => {
		render(<ChatBotInput {...defaultProps} />);
		expect(screen.getByPlaceholderText("Type your message...")).toBeInTheDocument();
		expect(screen.getByText("Button 1")).toBeInTheDocument();
		expect(screen.getByText("Button 2")).toBeInTheDocument();
		expect(screen.getByText("0/100")).toBeInTheDocument();
	});

	it("handles input changes correctly", () => {
		render(<ChatBotInput {...defaultProps} />);
		const input = screen.getByPlaceholderText("Type your message...");
		fireEvent.change(input, { target: { value: "Hello" } });
		expect(setTextAreaValueMock).toHaveBeenCalledWith("Hello");
	});
  
	it("submits input on Enter key press", () => {
		render(<ChatBotInput {...defaultProps} />);
		const input = screen.getByPlaceholderText("Type your message...");
		fireEvent.keyDown(input, { key: "Enter", code: "Enter", keyCode: 13 });
		expect(handleSubmitTextMock).toHaveBeenCalledTimes(1);
	});

});