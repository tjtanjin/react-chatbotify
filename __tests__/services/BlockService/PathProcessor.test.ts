import { processPath } from "../../../src/services/BlockService/PathProcessor";
import { Block } from "../../../src/types/Block";
import { Params } from "../../../src/types/Params";

// Basic params object for testing
const params: Params = {
	userInput: "testValue",
	currPath: null,
	prevPath: null,
	goToPath: jest.fn(),
	setTextAreaValue: jest.fn(),
	injectMessage: jest.fn(),
	simulateStreamMessage: jest.fn(),
	streamMessage: jest.fn(),
	removeMessage: jest.fn(),
	endStreamMessage: jest.fn(),
	showToast: jest.fn(),
	dismissToast: jest.fn(),
	toggleChatWindow: jest.fn()
};

describe("PathService.processPath", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("returns false when path is not defined", async () => {
		const block: Block = { path: undefined };

		const result = await processPath(block, params);
		expect(params.goToPath).not.toHaveBeenCalled();
		expect(result).toBe(false);
	});

	it("calls goToPath with a string path and returns its result", async () => {
		const block: Block = { path: "/home" };

		const result = await processPath(block, params);
		expect(params.goToPath).toHaveBeenCalledWith("/home");
		expect(result).toBe(true);
	});

	it("calls goToPath with a resolved promise from path function and returns its result", async () => {
		const block: Block = { path: (params: Params) => Promise.resolve(`/user/${params.userInput}`) };

		const result = await processPath(block, params);
		expect(params.goToPath).toHaveBeenCalledWith("/user/testValue");
		expect(result).toBe(true);
	});

	it("calls goToPath with a non-promise function result and returns its result", async () => {
		const block: Block = { path: (params: Params) => `/profile/${params.userInput}` };

		const result = await processPath(block, params);
		expect(params.goToPath).toHaveBeenCalledWith("/profile/testValue");
		expect(result).toBe(true);
	});

	it("returns false when parsed path is empty", async () => {
		const block: Block = { path: () => "" };

		const result = await processPath(block, params);
		expect(result).toBe(false);
		expect(params.goToPath).not.toHaveBeenCalled();
	});
});
