import { processIsSensitive } from "../../../src/services/BlockService/IsSensitiveProcessor";
import { Block } from "../../../src/types/Block";
import { Params } from "../../../src/types/Params";


describe('processIsSensitive', () => {
	let mockSetTextAreaSensitiveMode: jest.Mock;
	let mockParams: Params;

	beforeEach(() => {
		mockSetTextAreaSensitiveMode = jest.fn();
	});

	it('should set sensitive mode to false when isSensitive is falsy', async () => {
		const block: Block = { isSensitive: false };
		await processIsSensitive(block, mockSetTextAreaSensitiveMode, mockParams);
		expect(mockSetTextAreaSensitiveMode).toHaveBeenCalledWith(false);
	});

	it('should set sensitive mode to true when isSensitive is true', async () => {
		const block: Block = { isSensitive: true };
		await processIsSensitive(block, mockSetTextAreaSensitiveMode, mockParams);
		expect(mockSetTextAreaSensitiveMode).toHaveBeenCalledWith(true);
	});

	it('should handle isSensitive as a function', async () => {
		const block: Block = { isSensitive: () => true };
		await processIsSensitive(block, mockSetTextAreaSensitiveMode, mockParams);
		expect(mockSetTextAreaSensitiveMode).toHaveBeenCalledWith(true);
	});

	it('should handle async isSensitive function', async () => {
		const block: Block = { isSensitive: async () => false };
		await processIsSensitive(block, mockSetTextAreaSensitiveMode, mockParams);
		expect(mockSetTextAreaSensitiveMode).toHaveBeenCalledWith(false);
	});

	it('should pass params to isSensitive function', async () => {
		const mockIsSensitive = jest.fn().mockReturnValue(true);
		const block: Block = { isSensitive: mockIsSensitive };
		await processIsSensitive(block, mockSetTextAreaSensitiveMode, mockParams);
		expect(mockIsSensitive).toHaveBeenCalledWith(mockParams);
		expect(mockSetTextAreaSensitiveMode).toHaveBeenCalledWith(true);
	});

	it('should call setTextAreaSensitiveMode with false isSensitive is undefined', async () => {
		const block: Block = {};
		await processIsSensitive(block, mockSetTextAreaSensitiveMode, mockParams);
		expect(mockSetTextAreaSensitiveMode).toHaveBeenCalledWith(false);
	});
});
