import React from 'react'
import {
	preProcessBlock,
	postProcessBlock,
} from "../../../src/services/BlockService/BlockService";
import { processCheckboxes } from "../../../src/services/BlockService/CheckboxProcessor";
import { processFunction } from "../../../src/services/BlockService/FunctionProcessor";
import { processMessage } from "../../../src/services/BlockService/MessageProcessor";
import { processOptions } from "../../../src/services/BlockService/OptionProcessor";
import { processPath } from "../../../src/services/BlockService/PathProcessor";
import { processComponent } from "../../../src/services/BlockService/ComponentProcessor";
import { processTransition } from "../../../src/services/BlockService/TransitionProcessor";
import { processChatDisabled } from "../../../src/services/BlockService/ChatDisabledProcessor";
import { processIsSensitive } from "../../../src/services/BlockService/IsSensitiveProcessor";
import { Flow } from "../../../src/types/Flow";
import { Params } from "../../../src/types/Params";

// Mock the imported functions
jest.mock("../../../src/services/BlockService/CheckboxProcessor");
jest.mock("../../../src/services/BlockService/FunctionProcessor");
jest.mock("../../../src/services/BlockService/MessageProcessor");
jest.mock("../../../src/services/BlockService/OptionProcessor");
jest.mock("../../../src/services/BlockService/PathProcessor");
jest.mock("../../../src/services/BlockService/ComponentProcessor");
jest.mock("../../../src/services/BlockService/TransitionProcessor");
jest.mock("../../../src/services/BlockService/ChatDisabledProcessor");
jest.mock("../../../src/services/BlockService/IsSensitiveProcessor");


const MockComponent = () => <div>Mocked</div>

describe("BlockService", () => {
	const mockFlow: Flow = {
		start: {
			message: "Hello",
			options: ["Option 1", "Option 2"],
			checkboxes: ["Checkbox 1", "Checkbox 2"],
			component: MockComponent,
			chatDisabled: true,
			isSensitive: false,
			transition: { duration: 1000 },
			function: jest.fn(),
			path: "next",
		},
		next: {
			message: "Next message",
		},
	};

	const mockParams: Params = {
		injectMessage: jest.fn(),
		userInput: "sample input",
		currPath: "/current/path",
		prevPath: "/previous/path",
		goToPath: jest.fn(),
		setTextAreaValue: jest.fn(),
		streamMessage: jest.fn(),
		removeMessage: jest.fn(),
		endStreamMessage: jest.fn(),
		showToast: jest.fn(),
		dismissToast: jest.fn(),
		openChat: jest.fn(),
	};

	const mockSetTextAreaDisabled = jest.fn();
	const mockSetTextAreaSensitiveMode = jest.fn();
	const mockGoToPath = jest.fn();
	const mockSetTimeoutId = jest.fn();

	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe("preProcessBlock", () => {
		it("should call all pre-processing functions for valid attributes", async () => {
			await preProcessBlock(
				mockFlow,
				"start",
				mockParams,
				mockSetTextAreaDisabled,
				mockSetTextAreaSensitiveMode,
				mockGoToPath,
				mockSetTimeoutId
			);

			expect(processMessage).toHaveBeenCalled();
			expect(processOptions).toHaveBeenCalled();
			expect(processCheckboxes).toHaveBeenCalled();
			expect(processComponent).toHaveBeenCalled();
			expect(processChatDisabled).toHaveBeenCalled();
			expect(processIsSensitive).toHaveBeenCalled();
			expect(processTransition).toHaveBeenCalled();
		});

		it("should throw an error for invalid block", async () => {
			await expect(
				preProcessBlock(
					mockFlow,
					"invalid",
					mockParams,
					mockSetTextAreaDisabled,
					mockSetTextAreaSensitiveMode,
					mockGoToPath,
					mockSetTimeoutId
				)
			).rejects.toThrow("Block is not valid.");
		});
	});

	describe("postProcessBlock", () => {
		it("should call processFunction and processPath for valid attributes", async () => {
			await postProcessBlock(mockFlow, "start", mockParams, mockGoToPath);

			expect(processFunction).toHaveBeenCalled();
			expect(processPath).toHaveBeenCalled();
		});

		it("should throw an error for invalid block", async () => {
			await expect(
				postProcessBlock(mockFlow, "invalid", mockParams, mockGoToPath)
			).rejects.toThrow("Block is not valid.");
		});
	});
});
