import { Flow } from '../../../src/types/Flow';
import { Block } from '../../../src/types/Block';
import { Params } from '../../../src/types/Params';
import { processOptions } from '../../../src/services/BlockService/OptionProcessor';

jest.mock('../../../src/components/ChatBotBody/UserOptions/UserOptions', () => {
	return jest.fn;
});

describe('OptionProcessor', () => {
	const mockFlow: Flow = {};
	const mockPath: keyof Flow = 'testPath';
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

	it('should not process when options are not present', async () => {
		const mockBlock: Block = {};
		await processOptions(mockFlow, mockBlock, mockPath, mockParams);
		expect(mockParams.injectMessage).not.toHaveBeenCalled();
	});

	it('should process static options', async () => {
		const mockBlock: Block = {
			options: { items: ['Option 1', 'Option 2'] },
		};
		await processOptions(mockFlow, mockBlock, mockPath, mockParams);
		expect(mockParams.injectMessage).toHaveBeenCalledTimes(1);
		
	});

	it('should process function options', async () => {
		const mockBlock: Block = {
			options: () => ({ items: ['Option 1', 'Option 2'] }),
		};
		await processOptions(mockFlow, mockBlock, mockPath, mockParams);
		expect(mockParams.injectMessage).toHaveBeenCalledTimes(1);

	});

	it('should process async function options', async () => {
		const mockBlock: Block = {
			options: async () => ({ items: ['Option 1', 'Option 2'] }),
		};
		await processOptions(mockFlow, mockBlock, mockPath, mockParams);
		expect(mockParams.injectMessage).toHaveBeenCalledTimes(1);

	});

	it('should process array options', async () => {
		const mockBlock: Block = {
			options: ['Option 1', 'Option 2'],
		};
		await processOptions(mockFlow, mockBlock, mockPath, mockParams);
		expect(mockParams.injectMessage).toHaveBeenCalledTimes(1);

	});

	it('should not process when items array is empty', async () => {
		const mockBlock: Block = {
			options: { items: [] },
		};
		await processOptions(mockFlow, mockBlock, mockPath, mockParams);
		expect(mockParams.injectMessage).not.toHaveBeenCalled();
	});

	it('should use provided reusable value', async () => {
		const mockBlock: Block = {
			options: { items: ['Option 1', 'Option 2'], reusable: true },
		};
		await processOptions(mockFlow, mockBlock, mockPath, mockParams);
		expect(mockParams.injectMessage).toHaveBeenCalledTimes(1);

	});
});