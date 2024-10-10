import { processComponent } from '../../../src/services/BlockService/ComponentProcessor';
import { Block } from '../../../src/types/Block';
import { Params } from '../../../src/types/Params';
import React from 'react'

describe('processComponent', () => {
	let mockParams: Params;

	beforeEach(() => {
		mockParams = {
			injectMessage: jest.fn(),
		} as unknown as Params;
	});

	it('should do nothing if block has no component', async () => {
		const block: Block = { };
		await processComponent(block, mockParams);
		expect(mockParams.injectMessage).not.toHaveBeenCalled();
	});

	it('should inject message if component is a string', async () => {
		const block: Block = { component: <div>Hello, World!</div> };
		await processComponent(block, mockParams);
		expect(mockParams.injectMessage).toHaveBeenCalledWith(<div>Hello, World!</div>);
	});

	it('should inject message if component is a function returning a string', async () => {
		const block: Block = { component: () => <div>Function result</div> };
		await processComponent(block, mockParams);
		expect(mockParams.injectMessage).toHaveBeenCalledWith(<div>Function result</div>);
	});

	it('should inject message if component is a function returning a promise', async () => {
		const block: Block = { component: () => Promise.resolve(<div>Async result</div>) };
		await processComponent(block, mockParams);
		expect(mockParams.injectMessage).toHaveBeenCalledWith(<div>Async result</div>);
	});
    
	it('should pass params to component function', async () => {
		const mockComponentFn = jest.fn().mockReturnValue('Result');
		const block: Block = { component: mockComponentFn };
		await processComponent(block, mockParams);
		expect(mockComponentFn).toHaveBeenCalledWith(mockParams);
		expect(mockParams.injectMessage).toHaveBeenCalledWith('Result');
	});
});