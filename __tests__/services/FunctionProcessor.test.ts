import { processFunction } from "../../src/services/BlockService/FunctionProcessor";
import { Block } from "../../src/types/Block";
import { Params } from "../../src/types/Params";

describe('processFunction', () => {
    let params: Params;
    let mockGoToPath: jest.Mock;
    let mockSetTextAreaValue: jest.Mock;
    let mockInjectMessage: jest.Mock;
    let mockStreamMessage: jest.Mock;
    let mockRemoveMessage: jest.Mock;
    let mockEndStreamMessage: jest.Mock;
    let mockShowToast: jest.Mock;
    let mockDismissToast: jest.Mock;
    let mockOpenChat: jest.Mock;

    beforeEach(() => {
        mockGoToPath = jest.fn();
        mockSetTextAreaValue = jest.fn();
        mockInjectMessage = jest.fn().mockResolvedValue(null);
        mockStreamMessage = jest.fn().mockResolvedValue(null);
        mockRemoveMessage = jest.fn().mockResolvedValue(null);
        mockEndStreamMessage = jest.fn().mockResolvedValue(true);
        mockShowToast = jest.fn();
        mockDismissToast = jest.fn().mockReturnValue(null);
        mockOpenChat = jest.fn();

        params = {
            userInput: "",
            currPath: null,
            prevPath: null,
            goToPath: mockGoToPath,
            setTextAreaValue: mockSetTextAreaValue,
            injectMessage: mockInjectMessage,
            streamMessage: mockStreamMessage,
            removeMessage: mockRemoveMessage,
            endStreamMessage: mockEndStreamMessage,
            showToast: mockShowToast,
            dismissToast: mockDismissToast,
            openChat: mockOpenChat,
        };
    });

    it('should return undefined if block has no function', async () => {
        const block: Block = { function: undefined };

        const result = await processFunction(block, params);

        expect(result).toBeUndefined();
    });

    it('should return the result of the function if it is not a promise', async () => {
        const mockFunction = jest.fn().mockReturnValue('result');
        const block: Block = { function: mockFunction };

        const result = await processFunction(block, params);

        expect(result).toBe('result');
    });

    it('should return the resolved value of the function if it is a promise', async () => {
        const mockFunction = jest.fn().mockResolvedValue('resolved value');
        const block: Block = { function: mockFunction };

        const result = await processFunction(block, params);

        expect(result).toBe('resolved value');
    });

    it('should handle function throwing an error', async () => {
        const mockFunction = jest.fn(() => { throw new Error('error'); });
        const block: Block = { function: mockFunction };

        await expect(processFunction(block, params)).rejects.toThrow('error');
    });

    it('should handle function returning a rejected promise', async () => {
        const mockFunction = jest.fn().mockRejectedValue('rejected value');
        const block: Block = { function: mockFunction };

        await expect(processFunction(block, params)).rejects.toBe('rejected value');
    });
});
