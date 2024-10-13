import React from "react";
import { expect } from "@jest/globals";

import { processOptions } from "../../../src/services/BlockService/OptionProcessor";
import { Params } from "../../../src/types/Params";
import { Block } from "../../../src/types/Block";
import { Flow } from "../../../src/types/Flow";
import UserOptions from "../../../src/components/ChatBotBody/UserOptions/UserOptions";

describe("processOptions", () => {
	let mockParams: Params;
	let mockBlock: Block;
	let mockFlow: Flow;

	// Mock Params with injectMessage function
	beforeEach(() => {
		mockParams = {
			injectMessage: jest.fn() as Params["injectMessage"],
		} as Params;

		mockBlock = {
			options: undefined,
		} as Block;

		mockFlow = {} as Flow;
	});

	it("should not call injectMessage if block has no options", async () => {
		await processOptions(mockFlow, mockBlock, "somePath", mockParams);
		expect(mockParams.injectMessage).not.toHaveBeenCalled();
	});

	it("should process static options and call injectMessage", async () => {
		const staticOptions = ["Option1", "Option2"];
		mockBlock.options = staticOptions;

		await processOptions(mockFlow, mockBlock, "somePath", mockParams);
		expect(mockParams.injectMessage).toHaveBeenCalledWith(
			<UserOptions options={{ items: staticOptions, reusable: false }} path={"somePath"} />
		);
	});

	it("should process dynamic options (function) and call injectMessage", async () => {
		const dynamicOptions = ["DynamicOption1", "DynamicOption2"];
		mockBlock.options = jest.fn().mockReturnValue(dynamicOptions);

		await processOptions(mockFlow, mockBlock, "somePath", mockParams);
    
		expect(mockBlock.options).toHaveBeenCalledWith(mockParams);
		expect(mockParams.injectMessage).toHaveBeenCalledWith(
			<UserOptions options={{ items: dynamicOptions, reusable: false }} path={"somePath"} />
		);
	});

	it("should await async function options and call injectMessage with resolved value", async () => {
		const asyncOptions = ["AsyncOption1", "AsyncOption2"];
		mockBlock.options = jest.fn().mockResolvedValue(asyncOptions);

		await processOptions(mockFlow, mockBlock, "somePath", mockParams);
		expect(mockBlock.options).toHaveBeenCalledWith(mockParams);
		expect(mockParams.injectMessage).toHaveBeenCalledWith(
			<UserOptions options={{ items: asyncOptions, reusable: false }} path={"somePath"} />
		);
	});

	it("should set reusable to false by default if not provided", async () => {
		const staticOptions = ["Option1", "Option2"];
		mockBlock.options = staticOptions;

		await processOptions(mockFlow, mockBlock, "somePath", mockParams);
		expect(mockParams.injectMessage).toHaveBeenCalledWith(
			<UserOptions options={{ items: staticOptions, reusable: false }} path={"somePath"} />
		);
	});

	it("should not inject message if options is empty array", async () => {
		mockBlock.options = [];

		await processOptions(mockFlow, mockBlock, "somePath", mockParams);
		expect(mockParams.injectMessage).not.toHaveBeenCalled();
	});

	it("should not inject message if options has no 'items'", async () => {
		mockBlock.options = [];

		await processOptions(mockFlow, mockBlock, "somePath", mockParams);
		expect(mockParams.injectMessage).not.toHaveBeenCalled();
	});
});
