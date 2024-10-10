import React from 'react'
import { processCheckboxes } from '../../../src/services/BlockService/CheckboxProcessor';
import UserCheckboxes from '../../../src/components/ChatBotBody/UserCheckboxes/UserCheckboxes';
import { Block } from '../../../src/types/Block';
import { Flow } from '../../../src/types/Flow';
import { Params } from '../../../src/types/Params';

// Mock the UserCheckboxes component
jest.mock('../../../src/components/ChatBotBody/UserCheckboxes/UserCheckboxes', () => {
	return jest.fn()
});

describe('CheckboxProcessor', () => {
	let mockFlow: Flow;
	let mockBlock: Block;
	let mockPath: keyof Flow;
	let mockParams: Params;

	beforeEach(() => {
		mockFlow = {};
		mockBlock = {};
		mockPath = 'start';
		mockParams = {
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
			openChat: jest.fn(),		};
	});

	afterEach(() => {
		jest.clearAllMocks();
		(UserCheckboxes as jest.Mock).mockClear();
		(UserCheckboxes as jest.Mock).mockImplementation(() => <div>Mocked UserCheckboxes</div>);

	});

	it('should not process when checkboxes are not provided', async () => {
		await processCheckboxes(mockFlow, mockBlock, mockPath, mockParams);
		expect(mockParams.injectMessage).not.toHaveBeenCalled();
	});

	it('should process checkboxes when they are a function', async () => {
		const mockCheckboxes = jest.fn().mockReturnValue(['Option 1', 'Option 2']);
		mockBlock.checkboxes = mockCheckboxes;

		await processCheckboxes(mockFlow, mockBlock, mockPath, mockParams);

		expect(mockCheckboxes).toHaveBeenCalledWith(mockParams);
		expect(mockParams.injectMessage).toHaveBeenCalled();
	});

	it('should process checkboxes when they are an array', async () => {
		mockBlock.checkboxes = ['Option 1', 'Option 2', 'Option 3'];

		await processCheckboxes(mockFlow, mockBlock, mockPath, mockParams);

		expect(mockParams.injectMessage).toHaveBeenCalled();
	});

	it('should process checkboxes when they are an object', async () => {
		mockBlock.checkboxes = {
			items: ['Option 1', 'Option 2'],
			min: 2,
			max: 2,
			reusable: true,
			sendOutput: true,
		};

		await processCheckboxes(mockFlow, mockBlock, mockPath, mockParams);

		expect(mockParams.injectMessage).toHaveBeenCalled();
	});

	it('should handle async checkbox functions', async () => {
		const mockAsyncCheckboxes = jest.fn().mockResolvedValue(['Async Option 1', 'Async Option 2']);
		mockBlock.checkboxes = mockAsyncCheckboxes;

		await processCheckboxes(mockFlow, mockBlock, mockPath, mockParams);

		expect(mockAsyncCheckboxes).toHaveBeenCalledWith(mockParams);
		expect(mockParams.injectMessage).toHaveBeenCalled();
	});

	it('should not process when items array is empty', async () => {
		mockBlock.checkboxes = { items: [] };

		await processCheckboxes(mockFlow, mockBlock, mockPath, mockParams);

		expect(mockParams.injectMessage).not.toHaveBeenCalled();
	});

	it('should adjust min value when it exceeds max', async () => {
		mockBlock.checkboxes = {
			items: ['Option 1', 'Option 2'],
			min: 3,
			max: 2,
		};

		await processCheckboxes(mockFlow, mockBlock, mockPath, mockParams);

		expect(mockParams.injectMessage).toHaveBeenCalled();
	});
});
