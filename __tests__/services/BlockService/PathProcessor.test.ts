import { processPath } from "../../../src/services/BlockService/PathProcessor";
import { Block } from "../../../src/types/Block";
import { Params } from "../../../src/types/Params";

// Mock for goToPath function
const mockGoToPath = jest.fn();

// Basic params object for testing
const params: Params = {
	userInput: "testValue",
	currPath: null,
	prevPath: null,
	goToPath: jest.fn(),
	setTextAreaValue: jest.fn(),
	injectMessage: jest.fn(),
	streamMessage: jest.fn(),
	removeMessage: jest.fn(),
	endStreamMessage: jest.fn(),
	showToast: jest.fn(),
	dismissToast: jest.fn(),
	openChat: jest.fn()
};

describe("PathService.processPath", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("returns false when path is not defined", async () => {
		const block: Block = { path: undefined };

		const result = await processPath(block, params, mockGoToPath);
		expect(result).toBe(false);
		expect(mockGoToPath).not.toHaveBeenCalled();
	});

	it("calls goToPath with a string path and returns its result", async () => {
		const block: Block = { path: "/home" };
		mockGoToPath.mockResolvedValueOnce(true);

		const result = await processPath(block, params, mockGoToPath);
		expect(mockGoToPath).toHaveBeenCalledWith("/home");
		expect(result).toBe(true);
	});

	it("calls goToPath with a resolved promise from path function and returns its result", async () => {
		const block: Block = { path: (params: Params) => Promise.resolve(`/user/${params.userInput}`) };
		mockGoToPath.mockResolvedValueOnce(true);

		const result = await processPath(block, params, mockGoToPath);
		expect(mockGoToPath).toHaveBeenCalledWith("/user/testValue");
		expect(result).toBe(true);
	});

	it("calls goToPath with a non-promise function result and returns its result", async () => {
		const block: Block = { path: (params: Params) => `/profile/${params.userInput}` };
		mockGoToPath.mockResolvedValueOnce(true);

		const result = await processPath(block, params, mockGoToPath);
		expect(mockGoToPath).toHaveBeenCalledWith("/profile/testValue");
		expect(result).toBe(true);
	});

	it("returns false when parsed path is empty", async () => {
		const block: Block = { path: () => "" };

		const result = await processPath(block, params, mockGoToPath);
		expect(result).toBe(false);
		expect(mockGoToPath).not.toHaveBeenCalled();
	});

	it("handles rejected promise from goToPath gracefully", async () => {
		const block: Block = { path: "/settings" };
		mockGoToPath.mockRejectedValueOnce(new Error("Navigation failed"));

		await expect(processPath(block, params, mockGoToPath)).rejects.toThrow("Navigation failed");
		expect(mockGoToPath).toHaveBeenCalledWith("/settings");
	});
});
