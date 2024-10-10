import { processChatDisabled } from "../../../src/services/BlockService/ChatDisabledProcessor";
import { Block } from "../../../src/types/Block";
import { Params } from "../../../src/types/Params";


describe('processChatDisabled', () => {
	let setTextAreaDisabled: jest.Mock;
	let params: Params;

	beforeEach(() => {
		setTextAreaDisabled = jest.fn();
		params = {} as Params; // Mock params as needed
	});

	it('should return if chatDisabled is null', async () => {
		const block: Block = { };

		await processChatDisabled(block, setTextAreaDisabled, params);

		expect(setTextAreaDisabled).not.toHaveBeenCalled();
	});

	it('should set textarea disabled if chatDisabled is a boolean', async () => {
		const block: Block = { chatDisabled: true };

		await processChatDisabled(block, setTextAreaDisabled, params);

		expect(setTextAreaDisabled).toHaveBeenCalledWith(true);
	});

	it('should set textarea disabled if chatDisabled is a function returning a boolean', async () => {
		const block: Block = { chatDisabled: jest.fn(() => false) };

		await processChatDisabled(block, setTextAreaDisabled, params);

		expect(setTextAreaDisabled).toHaveBeenCalledWith(false);
		expect(block.chatDisabled).toHaveBeenCalledWith(params);
	});

	it('should set textarea disabled if chatDisabled is a function returning a promise', async () => {
		const block: Block = { chatDisabled: jest.fn(() => Promise.resolve(true)) };

		await processChatDisabled(block, setTextAreaDisabled, params);

		expect(setTextAreaDisabled).toHaveBeenCalledWith(true);
		expect(block.chatDisabled).toHaveBeenCalledWith(params);
	});
});