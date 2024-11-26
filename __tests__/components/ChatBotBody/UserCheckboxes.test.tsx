import React from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { useSettingsContext } from "../../../src/context/SettingsContext";
import { useStylesContext } from "../../../src/context/StylesContext";
import { usePathsContext } from "../../../src/context/PathsContext";
import { useSubmitInputInternal } from "../../../src/hooks/internal/useSubmitInputInternal";
import UserCheckboxes from "../../../src/components/ChatBotBody/UserCheckboxes/UserCheckboxes";

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

describe("UserCheckboxes Component", () => {
	const mockSettingsContext = {
		settings: {
			general: {
				primaryColor: "#000",
				actionDisabledIcon: "disabled-icon-url",
			},
			chatInput: {
				sendCheckboxOutput: true,
			},
			botBubble: {
				showAvatar: true,
			},
		},
	};

	const mockStylesContext = {
		styles: {
			botCheckboxRowStyle: { borderColor: "#000" },
			botCheckboxNextStyle: { color: "#000" },
			botCheckMarkStyle: { color: "transparent" },
			botCheckMarkSelectedStyle: { backgroundColor: "#000" },
		},
	};

	const mockPathsContext = {
		paths: [],
	};

	const mockHandleSubmitText = jest.fn();

	beforeEach(() => {
		(useSubmitInputInternal as jest.Mock).mockReturnValue({ handleSubmitText: mockHandleSubmitText });
		(useSettingsContext as jest.Mock).mockReturnValue(mockSettingsContext);
		(useStylesContext as jest.Mock).mockReturnValue(mockStylesContext);
		(usePathsContext as jest.Mock).mockReturnValue(mockPathsContext);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it("renders checkboxes correctly", () => {
		const checkboxes = { items: ["Checkbox 1", "Checkbox 2"], min: 1, max: 2 };
		render(<UserCheckboxes checkboxes={checkboxes} checkedItems={new Set()} path="path1" />);

		expect(screen.getByText("Checkbox 1")).toBeInTheDocument();
		expect(screen.getByText("Checkbox 2")).toBeInTheDocument();
	});

	it("allows selecting and unselecting checkboxes", () => {
		const checkboxes = { items: ["Checkbox 1", "Checkbox 2"], max: 2 };
		const checkedItems = new Set<string>();
		render(<UserCheckboxes checkboxes={checkboxes} checkedItems={checkedItems} path="path1" />);

		const checkbox1 = screen.getByText("Checkbox 1");
		const checkbox2 = screen.getByText("Checkbox 2");

		fireEvent.mouseDown(checkbox1);
		expect(checkedItems.has("Checkbox 1")).toBeTruthy();

		fireEvent.mouseDown(checkbox2);
		expect(checkedItems.has("Checkbox 2")).toBeTruthy();

		fireEvent.mouseDown(checkbox1);
		expect(checkedItems.has("Checkbox 1")).toBeFalsy();
	});

	it("prevents selecting more checkboxes than max limit", () => {
		const checkboxes = { items: ["Checkbox 1", "Checkbox 2", "Checkbox 3"], max: 2 };
		const checkedItems = new Set<string>();
		render(<UserCheckboxes checkboxes={checkboxes} checkedItems={checkedItems} path="path1" />);

		const checkbox1 = screen.getByText("Checkbox 1");
		const checkbox2 = screen.getByText("Checkbox 2");
		const checkbox3 = screen.getByText("Checkbox 3");

		// Select two checkboxes
		fireEvent.mouseDown(checkbox1);
		fireEvent.mouseDown(checkbox2);

		// Try checking a third checkbox
		fireEvent.mouseDown(checkbox3);
		expect(checkedItems.size).toBe(2); 
		expect(checkedItems.has("Checkbox 3")).toBeFalsy();
	});

	it("submits selected checkboxes on next button click", () => {
		const checkboxes = { items: ["Checkbox 1", "Checkbox 2"], sendOutput: true };
		const checkedItems = new Set<string>();
		const {container} = render(<UserCheckboxes checkboxes={checkboxes} checkedItems={checkedItems} path="path1" />);

		const checkbox1 = screen.getByText("Checkbox 1");
		fireEvent.mouseDown(checkbox1);

		const nextButton = container.getElementsByClassName("rcb-checkbox-next-button")[0];
		expect(nextButton).toBeDefined();

		// Click next button
		fireEvent.mouseDown(nextButton);

		expect(mockHandleSubmitText).toHaveBeenCalledTimes(1);
	});

	it("disables checkboxes based on path transition and reusability", () => {
		const checkboxes = { items: ["Checkbox 1"], reusable: false };
		const mockPaths = { paths: ["path1", "path2"] };
		(usePathsContext as jest.Mock).mockReturnValue(mockPaths);

		render(<UserCheckboxes checkboxes={checkboxes} checkedItems={new Set()} path="path1" />);

		const checkbox1 = screen.getByText("Checkbox 1");

		fireEvent.mouseDown(checkbox1);
		expect(mockHandleSubmitText).not.toHaveBeenCalled();
	});
	
});
