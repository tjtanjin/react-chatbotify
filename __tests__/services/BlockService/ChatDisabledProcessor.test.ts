import { processChatDisabled } from '../../../src/services/BlockService/ChatDisabledProcessor'; 
import { Block } from '../../../src/types/Block';
import { Params } from '../../../src/types/Params';

describe('processChatDisabled', () => {
	let mockSetTextAreaDisabled: jest.Mock;
	let params: Params;

	beforeEach(() => {
		mockSetTextAreaDisabled = jest.fn();
		params = {} as Params;
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('should not change textarea state if chatDisabled is null', async () => {
		const block= { chatDisabled: null } as unknown as Block;

		await processChatDisabled(block, mockSetTextAreaDisabled, params);

		expect(mockSetTextAreaDisabled).not.toHaveBeenCalled();
	});

	it('should not change textarea state if chatDisabled is undefined', async () => {
		const block: Block = { chatDisabled: undefined };

		await processChatDisabled(block, mockSetTextAreaDisabled, params);

		expect(mockSetTextAreaDisabled).not.toHaveBeenCalled();
	});

	it('should set textarea disabled state to true if chatDisabled is true', async () => {
		const block: Block = { chatDisabled: true };

		await processChatDisabled(block, mockSetTextAreaDisabled, params);

		expect(mockSetTextAreaDisabled).toHaveBeenCalledWith(true);
	});

	it('should set textarea disabled state to false if chatDisabled is false', async () => {
		const block: Block = { chatDisabled: false };

		await processChatDisabled(block, mockSetTextAreaDisabled, params);

		expect(mockSetTextAreaDisabled).toHaveBeenCalledWith(false);
	});

	it('should call chatDisabled function and set textarea state accordingly', async () => {
		const block: Block = { chatDisabled: jest.fn(() => false) };

		await processChatDisabled(block, mockSetTextAreaDisabled, params);

		expect(mockSetTextAreaDisabled).toHaveBeenCalledWith(false);
	});

	it('should handle async chatDisabled function correctly', async () => {
		const block: Block = { chatDisabled: jest.fn(async () => true) };

		await processChatDisabled(block, mockSetTextAreaDisabled, params);

		expect(mockSetTextAreaDisabled).toHaveBeenCalledWith(true);
	});
});
