import { expect } from "@jest/globals";

import { processIsSensitive } from "../../../src/services/BlockService/IsSensitiveProcessor";
import { Block } from "../../../src/types/Block";
import { Params } from "../../../src/types/Params";

describe("processIsSensitive", () => {
    let mockSetTextAreaSensitiveMode: jest.Mock;
    let mockBlock: Block;
    let mockParams: Params;

    beforeEach(() => {
        mockSetTextAreaSensitiveMode = jest.fn();
        mockBlock = {
            isSensitive: false,
        };
        mockParams = {} as Params;
    });

    it("should disable sensitive mode if block.isSensitive is undefined", async () => {
        mockBlock.isSensitive = undefined;
        await processIsSensitive(
            mockBlock,
            mockSetTextAreaSensitiveMode,
            mockParams
        );
        expect(mockSetTextAreaSensitiveMode).toHaveBeenCalledWith(false);
    });

    it("should disable sensitive mode if block.isSensitive is false", async () => {
        await processIsSensitive(
            mockBlock,
            mockSetTextAreaSensitiveMode,
            mockParams
        );
        expect(mockSetTextAreaSensitiveMode).toHaveBeenCalledWith(false);
    });

    it("should enable sensitive mode if block.isSensitive is true", async () => {
        mockBlock.isSensitive = true;
        await processIsSensitive(
            mockBlock,
            mockSetTextAreaSensitiveMode,
            mockParams
        );
        expect(mockSetTextAreaSensitiveMode).toHaveBeenCalledWith(true);
    });

    it("should enable sensitive mode if isSensitive is a function returning a boolean true", async () => {
        mockBlock.isSensitive = jest.fn().mockReturnValue(true);
        await processIsSensitive(
            mockBlock,
            mockSetTextAreaSensitiveMode,
            mockParams
        );
        expect(mockSetTextAreaSensitiveMode).toHaveBeenCalledWith(true);
        expect(mockBlock.isSensitive).toHaveBeenCalledWith(mockParams);
    });

    it("should disable sensitive mode if isSensitive is a function returning a boolean false", async () => {
        mockBlock.isSensitive = jest.fn().mockReturnValue(false);
        await processIsSensitive(
            mockBlock,
            mockSetTextAreaSensitiveMode,
            mockParams
        );
        expect(mockSetTextAreaSensitiveMode).toHaveBeenCalledWith(false);
        expect(mockBlock.isSensitive).toHaveBeenCalledWith(mockParams);
    });

    it("should enbale sensitive mode if isSensitive is a function returning a Promise with true", async () => {
        mockBlock.isSensitive = jest.fn().mockResolvedValue(true);
        await processIsSensitive(
            mockBlock,
            mockSetTextAreaSensitiveMode,
            mockParams
        );
        expect(mockSetTextAreaSensitiveMode).toHaveBeenCalledWith(true);
        expect(mockBlock.isSensitive).toHaveBeenCalledWith(mockParams);
    });

    it("should disable sensitive mode if isSensitive is a function returning a Promise with false", async () => {
        mockBlock.isSensitive = jest.fn().mockResolvedValue(false);
        await processIsSensitive(
            mockBlock,
            mockSetTextAreaSensitiveMode,
            mockParams
        );
        expect(mockSetTextAreaSensitiveMode).toHaveBeenCalledWith(false);
        expect(mockBlock.isSensitive).toHaveBeenCalledWith(mockParams);
    });
});
