import { processChatDisabled } from "../../../src/services/BlockService/ChatDisabledProcessor";
import { Block } from "../../../src/types/Block";
import { Params } from "../../../src/types/Params";


describe('processChatDisabled', () => {
	let mockSetTextAreaDisabled: jest.Mock;
	let block: Block;
	let params: Params;

	beforeEach(() => {
		mockSetTextAreaDisabled = jest.fn();
		params = {
			userInput: "test input",
			currPath: null, 
			prevPath: null, 
			goToPath: jest.fn(), 
			setTextAreaValue: jest.fn(),
			injectMessage: jest.fn(() => Promise.resolve(null)),
			streamMessage: jest.fn(() => Promise.resolve(null)),
			removeMessage: jest.fn(() => Promise.resolve(null)),
			endStreamMessage: jest.fn(() => Promise.resolve(true)),
			showToast: jest.fn(),
			dismissToast: jest.fn(() => null),
			openChat: jest.fn(),
			files: undefined, 
		} as Params;
	});

	it('should do nothing if block.chatDisabled is null', async () => {
		block = { chatDisabled: null } as Block;

		await processChatDisabled(block, mockSetTextAreaDisabled, params);

		expect(mockSetTextAreaDisabled).not.toHaveBeenCalled();
	});

	it('should call setTextAreaDisabled with the boolean value if block.chatDisabled is a boolean', async () => {
		block = { chatDisabled: true } as Block;

		await processChatDisabled(block, mockSetTextAreaDisabled, params);

		expect(mockSetTextAreaDisabled).toHaveBeenCalledWith(true);
	});

	it('should call setTextAreaDisabled with the return value of a func if block.chatDisabled is a func', async () => {
		block = {
			chatDisabled: jest.fn(() => false)
		} as unknown as Block;

		await processChatDisabled(block, mockSetTextAreaDisabled, params);

		expect(block.chatDisabled).toHaveBeenCalledWith(params);
		expect(mockSetTextAreaDisabled).toHaveBeenCalledWith(false);
	});

	it('should await the promise if block.chatDisabled is a function that returns a promise', async () => {
		block = {
			chatDisabled: jest.fn(() => Promise.resolve(true))
		} as unknown as Block;

		await processChatDisabled(block, mockSetTextAreaDisabled, params);

		expect(block.chatDisabled).toHaveBeenCalledWith(params);
		expect(mockSetTextAreaDisabled).toHaveBeenCalledWith(true);
	});

	it('should call setTextAreaDisabled with null if block.chatDisabled is a function returning null', async () => {
		block = {
			chatDisabled: jest.fn(() => null)
		} as unknown as Block;
    
		await processChatDisabled(block, mockSetTextAreaDisabled, params);
    
		expect(block.chatDisabled).toHaveBeenCalledWith(params);
		expect(mockSetTextAreaDisabled).toHaveBeenCalledWith(null);
	});
    
	it('should handle errors when block.chatDisabled function throws an error', async () => {
		block = {
			chatDisabled: jest.fn(() => {
				throw new Error('Test error');
			})
		} as unknown as Block;
    
		await expect(processChatDisabled(block, mockSetTextAreaDisabled, params))
			.rejects
			.toThrow('Test error');
    
		expect(mockSetTextAreaDisabled).not.toHaveBeenCalled();
	});
    
	it('should handle promise rejection if block.chatDisabled function returns a rejected promise', async () => {
		block = {
			chatDisabled: jest.fn(() => Promise.reject('Promise rejection'))
		} as unknown as Block;
    
		await expect(processChatDisabled(block, mockSetTextAreaDisabled, params))
			.rejects
			.toEqual('Promise rejection');
    
		expect(mockSetTextAreaDisabled).not.toHaveBeenCalled();
	});
    
	it('should handle unexpected data type for block.chatDisabled (e.g., an object)', async () => {
		block = { chatDisabled: {} } as unknown as Block;
    
		await processChatDisabled(block, mockSetTextAreaDisabled, params);
    
		// Expect that setTextAreaDisabled is called with an invalid type, in this case '{}'
		expect(mockSetTextAreaDisabled).toHaveBeenCalledWith({});
	});
});
