import { expect } from "@jest/globals";
import { processMessage } from "../../src/services/BlockService/MessageProcessor";
import { Params } from "../../src/types/Params";
import { Block } from "../../src/types/Block";

describe("MessageProcessor", () => {
	let mockParams: Params;
	let mockBlock: Block;

	// Mock Params with injectMessage function and empty Block
	beforeEach(() => {
		mockParams = {
			injectMessage: jest.fn() as Params["injectMessage"],
		} as Params;

		mockBlock = {} as Block;
	});

	// No message in block
	it("should not inject message if block has no message", async () => {
		await processMessage(mockBlock, mockParams);

		// Make sure injectMessage was not called
		expect(mockParams.injectMessage).not.toHaveBeenCalled();
	});

	// Empty string message
	it("should not inject message if block message is an empty string", async () => {
		mockBlock.message = "   ";
		await processMessage(mockBlock, mockParams);

		// Make sure injectMessage was not called if the message just contains whitespace
		expect(mockParams.injectMessage).not.toHaveBeenCalled();
	});

	// Valid string message
	it("should inject message if block has a non-empty string message", async () => {
		const message = "Test Message";
		mockBlock.message = message;
		await processMessage(mockBlock, mockParams);

		// Make sure injectMessage was called with the correct message
		expect(mockParams.injectMessage).toHaveBeenCalledWith(message);
	});

	// Function returning invalid content
	it("should not inject message if block message is a function returning invalid content", async () => {
		const functionResult = null;
		mockBlock.message = jest.fn().mockReturnValue(functionResult);

		await processMessage(mockBlock, mockParams);

		// Make sure injectMessage was not called if function returns null
		expect(mockParams.injectMessage).not.toHaveBeenCalledWith(functionResult);
	});

	// Function returning valid content
	it("should inject message if block message is a function returning valid content", async () => {
		const functionResult = "Function Result";
		mockBlock.message = jest.fn().mockReturnValue(functionResult);

		await processMessage(mockBlock, mockParams);

		// Check if the message function was called with correct params
		expect(mockBlock.message).toHaveBeenCalledWith(mockParams);
		
		// Make sure injectMessage was called with the function's return value
		expect(mockParams.injectMessage).toHaveBeenCalledWith(functionResult);
	});

	// Function returning a promise with invalid content
	it("should not inject message if block message is a function returning a promise with invalid content", async () => {
		mockBlock.message = jest.fn().mockResolvedValue(null);

		await processMessage(mockBlock, mockParams);

		// Make sure injectMessage was not called if content is invalid (null)
		expect(mockParams.injectMessage).not.toHaveBeenCalled();
	});

	// Function returning a promise with valid content
	it("should inject message if block message is a function returning a promise with valid content", async () => {
		const promiseResult = "Async Function Result";
		mockBlock.message = jest.fn().mockResolvedValue(promiseResult);

		await processMessage(mockBlock, mockParams);

		// Check if the message function was called with correct params
		expect(mockBlock.message).toHaveBeenCalledWith(mockParams);

		// Make sure injectMessage was called with the resolved promise value
		expect(mockParams.injectMessage).toHaveBeenCalledWith(promiseResult);
	});
});
