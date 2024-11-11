import React from "react";
import { expect } from "@jest/globals";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/jest-globals";

import ToastPrompt from "../../../../src/components/ChatBotToast/ToastPrompt/ToastPrompt";
import { useSettingsContext } from "../../../../src/context/SettingsContext";
import { useStylesContext } from "../../../../src/context/StylesContext";
import { useToastsInternal } from "../../../../src/hooks/internal/useToastsInternal";

// Mock the contexts
jest.mock("../../../../src/context/SettingsContext");
jest.mock("../../../../src/context/StylesContext");
jest.mock("../../../../src/hooks/internal/useToastsInternal");

/**
 * Helper function to render Toast with different props.
 *
 * @param content The content to be rendered in the toast.
 * @param timeout The timeout for auto-dismiss (optional).
 */
const renderToastPrompt = (content: string | JSX.Element = "Test Toast Message", timeout?: number) => {
	return render(
		<ToastPrompt id="test" content={content} timeout={timeout} />
	);
};

describe("ToastPrompt Component", () => {
	let dismissToastMock: jest.Mock;

	beforeEach(() => {
		// Reset the mocks before each test
		dismissToastMock = jest.fn();

		// Mock the contexts" values
		(useSettingsContext as jest.Mock).mockReturnValue({
			settings: {
				general: { primaryColor: "blue" },
				toast: { dismissOnClick: true },
			},
		});

		(useStylesContext as jest.Mock).mockReturnValue({
			styles: {
				toastPromptStyle: { backgroundColor: "white" },
				toastPromptHoveredStyle: { borderColor: "blue" },
			},
		});

		(useToastsInternal as jest.Mock).mockReturnValue({
			dismissToast: dismissToastMock,
		});
	});

	it("renders with correct content", () => {
		// Render the toast
		renderToastPrompt("Test Toast Message");

		// Check if the toast is in the document
		const toastElement = screen.getByText("Test Toast Message");
		expect(toastElement).toBeInTheDocument();

		// Check if the correct style is applied
		expect(toastElement).toHaveStyle("background-color: white");
	});

	it("dismisses toast on click when dismissOnClick is true", () => {
		// Render the toast
		renderToastPrompt();

		// Simulate click on the toast
		const toastElement = screen.getByText("Test Toast Message");
		fireEvent.mouseDown(toastElement);

		// Assert that the toast was dismissed
		expect(dismissToastMock).toHaveBeenCalledWith("test");
	});

	it("auto-dismisses the toast after the specified timeout", async () => {
		// Use fake timers
		jest.useFakeTimers();

		// Render the toast with a timeout
		renderToastPrompt("Test Toast Message", 1000);

		// Verify the toast is in the document
		const toastElement = screen.getByText("Test Toast Message");
		expect(toastElement).toBeInTheDocument();

		// Fast-forward until all timers have been executed
		jest.advanceTimersByTime(1000);

		// Check if dismissToast has been called with the correct argument
		expect(dismissToastMock).toHaveBeenCalledWith("test");

		// Restore real timers
		jest.useRealTimers();
	});

	it("applies hovered styles when mouse enters", () => {
		// Render the toast
		renderToastPrompt("Test Toast Message");

		// Get the toast element
		const toastElement = screen.getByText("Test Toast Message");

		// Simulate mouse entering the element
		fireEvent.mouseEnter(toastElement);

		// Assert that the hovered style is applied
		expect(toastElement).toHaveStyle("border-color: blue");
	});

	it("reverts to default style when mouse leaves", () => {
		// Render the toast
		renderToastPrompt("Test Toast Message");

		// Get the toast element
		const toastElement = screen.getByText("Test Toast Message");

		// Simulate mouse entering and leaving the element
		fireEvent.mouseEnter(toastElement);
		fireEvent.mouseLeave(toastElement);

		// Assert that the default style is reapplied
		expect(toastElement).toHaveStyle("background-color: white");
	});

	it("renders with correct styles from settings", () => {
		const settings = {
			general: { primaryColor: "red" },
			toast: { dismissOnClick: true },
		};

		(useSettingsContext as jest.Mock).mockReturnValue({ settings });

		(useStylesContext as jest.Mock).mockReturnValue({
			styles: {
				toastPromptStyle: { backgroundColor: "white", color: "black" },
				toastPromptHoveredStyle: { borderColor: "red" },
			},
		});

		renderToastPrompt("Test Toast Message");

		const toastElement = screen.getByText("Test Toast Message");

		// Check styles applied
		expect(toastElement).toHaveStyle("color: black"); // Default style
		expect(toastElement).toHaveStyle("background-color: white"); // Default style
	});


	it("renders content as a string", () => {
		renderToastPrompt("String Content");

		// Check if the content is rendered correctly
		expect(screen.getByText("String Content")).toBeInTheDocument();
	});

	it("handles when timeout is not provided", () => {
		// Render the toast without a timeout
		renderToastPrompt("Test Toast Message");

		// Verify the toast is present
		const toastElement = screen.getByText("Test Toast Message");
		expect(toastElement).toBeInTheDocument();

		// Immediately call the dismiss function
		setTimeout(() => {
			expect(dismissToastMock).toHaveBeenCalledWith("test");
		}, 0);
	});

	it("renders correctly when settings.general is undefined", () => {
		// Mock settings with general as undefined
		(useSettingsContext as jest.Mock).mockReturnValue({
			settings: {
				general: undefined, // This is the case we"re testing
				toast: { dismissOnClick: true },
			},
		});
    
		// Mock the dismissToast function
		const dismissToastMock = jest.fn();
		(useToastsInternal as jest.Mock).mockReturnValue({
			dismissToast: dismissToastMock,
		});
    
		// Render the toast
		renderToastPrompt("Test Toast Message");
    
		const toastElement = screen.getByText("Test Toast Message");
    
		// Check if the toast is rendered
		expect(toastElement).toBeInTheDocument();
    
		// Ensure that default styles are applied, since primaryColor is undefined
		expect(toastElement).toHaveStyle("background-color: white"); // Assuming this is the default style
    
		// Check that the border-color is not applied
		const computedStyle = window.getComputedStyle(toastElement);
		expect(computedStyle.borderColor).toBe(""); // Checks that the borderColor is not set
	});
    
	it("renders JSX content correctly", () => {
		const mockContent = <strong>Test Toast Message as JSX</strong>;

		// Render the toast with JSX content
		renderToastPrompt(mockContent);

		// Check if the JSX content is in the document
		expect(screen.getByText("Test Toast Message as JSX")).toBeInTheDocument();
	});

	it("does not dismiss toast on click when dismissOnClick is false", () => {
		const dismissToastMock = jest.fn();
		(useToastsInternal as jest.Mock).mockReturnValue({
			dismissToast: dismissToastMock,
		});

		const settings = {
			general: { primaryColor: "green" },
			toast: { dismissOnClick: false }, // Set dismissOnClick to false
		};

		(useSettingsContext as jest.Mock).mockReturnValue({ settings });

		// Render the toast
		renderToastPrompt("Test Toast Message");

		const toastElement = screen.getByText("Test Toast Message");

		// Simulate mouse down event
		fireEvent.mouseDown(toastElement);

		// Expect dismissToast to NOT have been called
		expect(dismissToastMock).not.toHaveBeenCalled();
	});

	it("does not dismiss toast on click when settings.toast is undefined", () => {
		// Update settings to set toast to undefined
		(useSettingsContext as jest.Mock).mockReturnValue({
			settings: {
				general: { primaryColor: "blue" },
				toast: undefined, 
			},
		});

		// Render the toast
		renderToastPrompt("Test Toast Message");

		const toastElement = screen.getByText("Test Toast Message");

		// Simulate click on the toast
		fireEvent.mouseDown(toastElement);

		// Assert that the toast was NOT dismissed
		expect(dismissToastMock).not.toHaveBeenCalled();
	});


});
