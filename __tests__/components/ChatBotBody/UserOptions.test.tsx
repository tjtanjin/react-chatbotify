import React from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { useSettingsContext } from "../../../src/context/SettingsContext";
import { useStylesContext } from "../../../src/context/StylesContext";
import { usePathsContext } from "../../../src/context/PathsContext";
import { useSubmitInputInternal } from "../../../src/hooks/internal/useSubmitInputInternal";
import UserOptions from "../../../src/components/ChatBotBody/UserOptions/UserOptions";

// Mocking the context and hook
jest.mock("../../../src/context/SettingsContext", () => ({
	useSettingsContext: jest.fn(),
}));
jest.mock("../../../src/context/StylesContext", () => ({
	useStylesContext: jest.fn(),
}));
jest.mock("../../../src/context/PathsContext", () => ({
	usePathsContext: jest.fn(),
}));
jest.mock("../../../src/hooks/internal/useSubmitInputInternal", () => ({
	useSubmitInputInternal: jest.fn(),
}));

describe("UserOptions Component", () => {
	// Mock implementation for contexts
	const mockSettingsContext = {
		settings: {
			general: {
				primaryColor: "#000",
				actionDisabledIcon: "disabled-icon-url",
			},
			chatInput: {
				sendOptionOutput: true,
			},
			botBubble: {
				showAvatar: true,
			},
		},
	};

	const mockStylesContext = {
		styles: {
			botOptionStyle: { backgroundColor: "#000" },
			botOptionHoveredStyle: { backgroundColor: "rgb(66, 176, 197)" },
		},
	};

	const mockPathsContext = {
		paths: [],
	};

	const mockHandleSubmitText = jest.fn();

	beforeEach(() => {
		(useSettingsContext as jest.Mock).mockReturnValue(mockSettingsContext);
		(useStylesContext as jest.Mock).mockReturnValue(mockStylesContext);
		(usePathsContext as jest.Mock).mockReturnValue(mockPathsContext);
		(useSubmitInputInternal as jest.Mock).mockReturnValue({ handleSubmitText: mockHandleSubmitText });
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	test("renders the options correctly", () => {
		const options = { items: ["Option 1", "Option 2"], sendOutput: true, reusable: false };
		render(<UserOptions options={options} path="path1" />);

		// Checking if the options are rendered correctly
		expect(screen.getByText("Option 1")).toBeInTheDocument();
		expect(screen.getByText("Option 2")).toBeInTheDocument();
	});

	test("handles mouse enter and leave events", () => {
		const options = { items: ["Option 1"], sendOutput: true, reusable: false };
		render(<UserOptions options={options} path="path1" />);
    
		const optionElement = screen.getByText("Option 1");

		// Hover over the option
		fireEvent.mouseEnter(optionElement);
		expect(optionElement).toHaveStyle("background-color: rgb(66, 176, 197)"); // Check the hover color

		// Mouse leave the option
		fireEvent.mouseLeave(optionElement);
		expect(optionElement).toHaveStyle("background-color: #000"); // Check the original color
	});

	test("disables the option when clicked and not reusable", () => {
		const options = { items: ["Option 1"], sendOutput: true, reusable: false };
		render(<UserOptions options={options} path="path1" />);
    
		const optionElement = screen.getByText("Option 1");

		// Click on the option
		fireEvent.mouseDown(optionElement);

		// Check if handleSubmitText is called with the correct parameters
		expect(mockHandleSubmitText).toHaveBeenCalledWith("Option 1", true);

		// Click again to verify that the option is disabled and cannot be clicked again
		fireEvent.mouseDown(optionElement);
		expect(mockHandleSubmitText).toHaveBeenCalledTimes(1);
	});

	test("respects the sendOutput setting", () => {
		const options = { items: ["Option 1"], reusable: true };
		render(<UserOptions options={options} path="path1" />);
    
		const optionElement = screen.getByText("Option 1");

		// Click on the option without explicit sendOutput in options
		fireEvent.mouseDown(optionElement);

		// It should default to the context value of sendOptionOutput
		expect(mockHandleSubmitText).toHaveBeenCalledWith("Option 1", true);
	});
});
