import { processFunction } from "../../src/services/BlockService/FunctionProcessor";
import { Block } from "../../src/types/Block";
import { Params } from "../../src/types/Params";

describe('processFunction', () => {
    let params: Params;

    beforeEach(() => {
        params = {
            userInput: "",
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
    });

    it('should return undefined if block has no function', async () => {
        const block: Block = { function: undefined };

        const result = await processFunction(block, params);

        expect(result).toBeUndefined();
    });

    it('should return the result of the function if it is not a promise', async () => {
        const block: Block = { function: jest.fn(() => 'result') };

        const result = await processFunction(block, params);

        expect(result).toBe('result');
    });

    it('should return the resolved value of the function if it is a promise', async () => {
        const block: Block = { function: jest.fn(() => Promise.resolve('resolved value')) };

        const result = await processFunction(block, params);

        expect(result).toBe('resolved value');
    });

    it('should handle function throwing an error', async () => {
        const block: Block = { function: jest.fn(() => { throw new Error('error'); }) };

        await expect(processFunction(block, params)).rejects.toThrow('error');
    });

    it('should handle function returning a rejected promise', async () => {
        const block: Block = { function: jest.fn(() => Promise.reject('rejected value')) };

        await expect(processFunction(block, params)).rejects.toBe('rejected value');
    });
});
