import React from 'react'

import { expect } from "@jest/globals";

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
import { Params } from "../../../src/types/Params";
import { Block } from '../../../src/types/Block';

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
	const mockBlock: Block = {
		message: "Hello",
		options: ["Option 1", "Option 2"],
		checkboxes: ["Checkbox 1", "Checkbox 2"],
		component: MockComponent,
		chatDisabled: true,
		isSensitive: false,
		transition: { duration: 1000 },
		function: jest.fn(),
		path: "next",
	};

	const mockInvalidBlock = null as any;

	const mockParams: Params = {
		injectMessage: jest.fn(),
		userInput: "sample input",
		currPath: "/current/path",
		prevPath: "/previous/path",
		goToPath: jest.fn(),
		setTextAreaValue: jest.fn(),
		simulateStreamMessage: jest.fn(),
		streamMessage: jest.fn(),
		removeMessage: jest.fn(),
		endStreamMessage: jest.fn(),
		showToast: jest.fn(),
		dismissToast: jest.fn(),
		toggleChatWindow: jest.fn(),
	};

	const mockTimeoutIdRef = {current: null};
	const mockSetTextAreaDisabled = jest.fn();
	const mockSetTextAreaSensitiveMode = jest.fn();
	const mockFirePostProcessBlockEvent = jest.fn();

	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe("preProcessBlock", () => {
		it("should call all pre-processing functions for valid attributes", async () => {
			await preProcessBlock(
				mockBlock,
				mockParams,
				false,
				mockTimeoutIdRef,
				mockSetTextAreaDisabled,
				mockSetTextAreaSensitiveMode,
				mockFirePostProcessBlockEvent,
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
					mockInvalidBlock,
					mockParams,
					false,
					mockTimeoutIdRef,
					mockSetTextAreaDisabled,
					mockSetTextAreaSensitiveMode,
					mockFirePostProcessBlockEvent,
				)
			).rejects.toThrow("Block is not valid.");
		});
	});

	describe("postProcessBlock", () => {
		it("should call processFunction and processPath for valid attributes", async () => {
			await postProcessBlock(mockBlock, mockParams);

			expect(processFunction).toHaveBeenCalled();
			expect(processPath).toHaveBeenCalled();
		});

		it("should throw an error for invalid block", async () => {
			await expect(
				postProcessBlock(mockInvalidBlock, mockParams)
			).rejects.toThrow("Block is not valid.");
		});
	});
});
