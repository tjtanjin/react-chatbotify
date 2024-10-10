import { processMessage } from "../../../src/services/BlockService/MessageProcessor";
import { Block } from "../../../src/types/Block";
import { Params } from "../../../src/types/Params";

describe("MessageProcessor", () => {
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

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("should process a string message", async () => {
		const block: Block = { message: "Hello, world!" };
		await processMessage(block, mockParams);
		expect(mockParams.injectMessage).toHaveBeenCalledWith("Hello, world!");
	});

	it("should process a function message", async () => {
		const block: Block = { message: () => "Hello from function!" };
		await processMessage(block, mockParams);
		expect(mockParams.injectMessage).toHaveBeenCalledWith("Hello from function!");
	});

	it("should process an async function message", async () => {
		const block: Block = { message: async () => "Hello from async function!" };
		await processMessage(block, mockParams);
		expect(mockParams.injectMessage).toHaveBeenCalledWith(
			"Hello from async function!"
		);
	});

	it("should not inject empty messages", async () => {
		const block: Block = { message: "" };
		await processMessage(block, mockParams);
		expect(mockParams.injectMessage).not.toHaveBeenCalled();
	});

	it("should not inject whitespace-only messages", async () => {
		const block: Block = { message: "   " };
		await processMessage(block, mockParams);
		expect(mockParams.injectMessage).not.toHaveBeenCalled();
	});

	it("should handle blocks without a message", async () => {
		const block: Block = {};
		await processMessage(block, mockParams);
		expect(mockParams.injectMessage).not.toHaveBeenCalled();
	});

	it("should handle function messages that return null", async () => {
		const block: Block = { message: () => "" };
		await processMessage(block, mockParams);
		expect(mockParams.injectMessage).not.toHaveBeenCalled();
	});
});
