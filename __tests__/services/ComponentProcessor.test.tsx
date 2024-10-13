import React from "react";
import { expect } from "@jest/globals";
import { processComponent } from "../../src/services/BlockService/ComponentProcessor";
import { Params } from "../../src/types/Params";
import { Block } from "../../src/types/Block";


describe("ComponentProcessor", () => {
	let mockParams: Params;
	let mockBlock: Block;

	// Mock Params with injectMessage function and empty Block
	beforeEach(() => {
		mockParams = {
			injectMessage: jest.fn() as Params["injectMessage"],
		} as Params;

		mockBlock = {} as Block;
	});

	it("should not call injectMessage if block has no component", async () => {
		await processComponent(mockBlock, mockParams);
		// Check if injectMessage was not called when block has no component
		expect(mockParams.injectMessage).not.toHaveBeenCalled();
	});

	it("should call injectMessage where block component is a JSX element", async () => {
		// Mock block component as a JSX element
		const component = <div>Test Component</div>;
		mockBlock.component = component;

		await processComponent(mockBlock, mockParams);
		// Check if injectMessage was called with the JSX element
		expect(mockParams.injectMessage).toHaveBeenCalledWith(component);
	});

	it("should call injectMessage with the result of block component that is a function", async () => {
		const functionResult = <div>Function Result</div>;
		// Mock block component as a function that returns a JSX element
		mockBlock.component = jest.fn().mockReturnValue(functionResult);

		await processComponent(mockBlock, mockParams);
		// Check if block component was called with the correct params
		expect(mockBlock.component).toHaveBeenCalledWith(mockParams);
		// Check if injectMessage was called with result of function
		expect(mockParams.injectMessage).toHaveBeenCalledWith(functionResult);
	});

	it("should call injectMessage with the resolved value of block component that is an async function", async () => {
		const asyncResult = <div>Async Result</div>;
		// Mock block component as an async function that resolves to a JSX element
		mockBlock.component = jest.fn().mockResolvedValue(asyncResult);

		await processComponent(mockBlock, mockParams);
		// Check if block component was called with the correct params
		expect(mockBlock.component).toHaveBeenCalledWith(mockParams);
		// Check if injectMessage was called with the resolved value of the promise
		expect(mockParams.injectMessage).toHaveBeenCalledWith(asyncResult);
	});

	it("should not inject message if block component returns invalid value", async () => {
		// Mock block component to return invalid value
		mockBlock.component = jest.fn().mockReturnValue(null);

		await processComponent(mockBlock, mockParams);
		// Check if block component was called with the correct params
		expect(mockBlock.component).toHaveBeenCalledWith(mockParams);
		// Check if injectMessage was not called when block component returns invalid value
		expect(mockParams.injectMessage).not.toHaveBeenCalled();
	});

	it("should not inject message if async block component returns invalid value", async () => {
		// Mock block component as an async function that resolves to invalid value
		mockBlock.component = jest.fn().mockResolvedValue(undefined);

		await processComponent(mockBlock, mockParams);
		// Check if block component was called with the correct params
		expect(mockBlock.component).toHaveBeenCalledWith(mockParams);
		// Check if injectMessage was not called when block component returns invalid value
		expect(mockParams.injectMessage).not.toHaveBeenCalled();
	});
});
