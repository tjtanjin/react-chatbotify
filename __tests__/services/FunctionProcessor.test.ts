import { processFunction } from "../../src/services/BlockService/FunctionProcessor";
import { Block } from "../../src/types/Block";
import { Params } from "../../src/types/Params";

describe('processFunction', () => {
    it('should return undefined if block has no function', async () => {
        const block: Block = { function: undefined };
        const params: Params = {
            userInput: "",
            currPath: null,
            prevPath: null,
            goToPath: function (pathToGo: string): void {
                throw new Error("Function not implemented.");
            },
            setTextAreaValue: function (value: string): void {
                throw new Error("Function not implemented.");
            },
            injectMessage: function (content: string | JSX.Element, sender?: string | undefined): Promise<string | null> {
                throw new Error("Function not implemented.");
            },
            streamMessage: function (content: string | JSX.Element, sender?: string | undefined): Promise<string | null> {
                throw new Error("Function not implemented.");
            },
            removeMessage: function (id: string): Promise<string | null> {
                throw new Error("Function not implemented.");
            },
            endStreamMessage: function (sender: string): Promise<boolean> {
                throw new Error("Function not implemented.");
            },
            showToast: function (content: string | JSX.Element, timeout?: number | undefined): void {
                throw new Error("Function not implemented.");
            },
            dismissToast: function (id: string): string | null {
                throw new Error("Function not implemented.");
            },
            openChat: function (isOpen: boolean): void {
                throw new Error("Function not implemented.");
            }
        };

        const result = await processFunction(block, params);

        expect(result).toBeUndefined();
    });

    it('should return the result of the function if it is not a promise', async () => {
        const block: Block = { function: (params: Params) => 'result' };
        const params: Params = {
            userInput: "",
            currPath: null,
            prevPath: null,
            goToPath: function (pathToGo: string): void {
                throw new Error("Function not implemented.");
            },
            setTextAreaValue: function (value: string): void {
                throw new Error("Function not implemented.");
            },
            injectMessage: function (content: string | JSX.Element, sender?: string | undefined): Promise<string | null> {
                throw new Error("Function not implemented.");
            },
            streamMessage: function (content: string | JSX.Element, sender?: string | undefined): Promise<string | null> {
                throw new Error("Function not implemented.");
            },
            removeMessage: function (id: string): Promise<string | null> {
                throw new Error("Function not implemented.");
            },
            endStreamMessage: function (sender: string): Promise<boolean> {
                throw new Error("Function not implemented.");
            },
            showToast: function (content: string | JSX.Element, timeout?: number | undefined): void {
                throw new Error("Function not implemented.");
            },
            dismissToast: function (id: string): string | null {
                throw new Error("Function not implemented.");
            },
            openChat: function (isOpen: boolean): void {
                throw new Error("Function not implemented.");
            }
        };

        const result = await processFunction(block, params);

        expect(result).toBe('result');
    });

    it('should return the resolved value of the function if it is a promise', async () => {
        const block: Block = { function: (params: Params) => Promise.resolve('resolved value') };
        const params: Params = {
            userInput: "",
            currPath: null,
            prevPath: null,
            goToPath: function (pathToGo: string): void {
                throw new Error("Function not implemented.");
            },
            setTextAreaValue: function (value: string): void {
                throw new Error("Function not implemented.");
            },
            injectMessage: function (content: string | JSX.Element, sender?: string | undefined): Promise<string | null> {
                throw new Error("Function not implemented.");
            },
            streamMessage: function (content: string | JSX.Element, sender?: string | undefined): Promise<string | null> {
                throw new Error("Function not implemented.");
            },
            removeMessage: function (id: string): Promise<string | null> {
                throw new Error("Function not implemented.");
            },
            endStreamMessage: function (sender: string): Promise<boolean> {
                throw new Error("Function not implemented.");
            },
            showToast: function (content: string | JSX.Element, timeout?: number | undefined): void {
                throw new Error("Function not implemented.");
            },
            dismissToast: function (id: string): string | null {
                throw new Error("Function not implemented.");
            },
            openChat: function (isOpen: boolean): void {
                throw new Error("Function not implemented.");
            }
        };

        const result = await processFunction(block, params);

        expect(result).toBe('resolved value');
    });

    it('should handle function throwing an error', async () => {
        const block: Block = { function: (params: Params) => { throw new Error('error'); } };
        const params: Params = {
            userInput: "",
            currPath: null,
            prevPath: null,
            goToPath: function (pathToGo: string): void {
                throw new Error("Function not implemented.");
            },
            setTextAreaValue: function (value: string): void {
                throw new Error("Function not implemented.");
            },
            injectMessage: function (content: string | JSX.Element, sender?: string | undefined): Promise<string | null> {
                throw new Error("Function not implemented.");
            },
            streamMessage: function (content: string | JSX.Element, sender?: string | undefined): Promise<string | null> {
                throw new Error("Function not implemented.");
            },
            removeMessage: function (id: string): Promise<string | null> {
                throw new Error("Function not implemented.");
            },
            endStreamMessage: function (sender: string): Promise<boolean> {
                throw new Error("Function not implemented.");
            },
            showToast: function (content: string | JSX.Element, timeout?: number | undefined): void {
                throw new Error("Function not implemented.");
            },
            dismissToast: function (id: string): string | null {
                throw new Error("Function not implemented.");
            },
            openChat: function (isOpen: boolean): void {
                throw new Error("Function not implemented.");
            }
        };

        await expect(processFunction(block, params)).rejects.toThrow('error');
    });

    it('should handle function returning a rejected promise', async () => {
        const block: Block = { function: (params: Params) => Promise.reject('rejected value') };
        const params: Params = {
            userInput: "",
            currPath: null,
            prevPath: null,
            goToPath: function (pathToGo: string): void {
                throw new Error("Function not implemented.");
            },
            setTextAreaValue: function (value: string): void {
                throw new Error("Function not implemented.");
            },
            injectMessage: function (content: string | JSX.Element, sender?: string | undefined): Promise<string | null> {
                throw new Error("Function not implemented.");
            },
            streamMessage: function (content: string | JSX.Element, sender?: string | undefined): Promise<string | null> {
                throw new Error("Function not implemented.");
            },
            removeMessage: function (id: string): Promise<string | null> {
                throw new Error("Function not implemented.");
            },
            endStreamMessage: function (sender: string): Promise<boolean> {
                throw new Error("Function not implemented.");
            },
            showToast: function (content: string | JSX.Element, timeout?: number | undefined): void {
                throw new Error("Function not implemented.");
            },
            dismissToast: function (id: string): string | null {
                throw new Error("Function not implemented.");
            },
            openChat: function (isOpen: boolean): void {
                throw new Error("Function not implemented.");
            }
        };

        await expect(processFunction(block, params)).rejects.toBe('rejected value');
    });
});