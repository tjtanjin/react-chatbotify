import { processCheckboxes } from "../../../src/services/BlockService/CheckboxProcessor";
import { Block } from "../../../src/types/Block";
import { Flow } from "../../../src/types/Flow";
import { Params } from "../../../src/types/Params";

describe("processCheckboxes", () => {
	let mockFlow: Flow;
	let mockBlock: Block;
	let mockParams: Params;

	beforeEach(() => {
		mockFlow = {} as Flow;
		mockBlock = {} as Block;
		mockParams = {
			injectMessage: jest.fn(),
		} as unknown as Params;
	});

	it("should return early if block has no checkboxes", async () => {
		await processCheckboxes(mockFlow, mockBlock, "somePath", mockParams);

		expect(mockParams.injectMessage).not.toHaveBeenCalled();
	});

	it("should process checkboxes when checkboxes are provided as a function", async () => {
		const checkboxItems = ["Option 1", "Option 2"];
		mockBlock.checkboxes = jest.fn().mockReturnValue(checkboxItems);

		await processCheckboxes(mockFlow, mockBlock, "somePath", mockParams);

		expect(mockBlock.checkboxes).toHaveBeenCalledWith(mockParams);
		expect(mockParams.injectMessage).toHaveBeenCalled();
	});

	it("should handle async checkbox functions", async () => {
		const asyncCheckboxItems = ["Option A", "Option B"];
		mockBlock.checkboxes = jest.fn().mockResolvedValue(asyncCheckboxItems);

		await processCheckboxes(mockFlow, mockBlock, "somePath", mockParams);

		expect(mockBlock.checkboxes).toHaveBeenCalledWith(mockParams);
		expect(mockParams.injectMessage).toHaveBeenCalled();
	});

	it("should convert checkbox array to object with items", async () => {
		mockBlock.checkboxes = ["Checkbox 1", "Checkbox 2"];

		await processCheckboxes(mockFlow, mockBlock, "somePath", mockParams);

		const expectedCheckboxes = { items: ["Checkbox 1", "Checkbox 2"] };
		expect(mockParams.injectMessage).toHaveBeenCalled();
		const [content] = (mockParams.injectMessage as jest.Mock).mock.calls[0];
		expect(content.props.checkboxes).toMatchObject(expectedCheckboxes);
	});

	it("should set min and max values when not provided", async () => {
		mockBlock.checkboxes = { items: ["Item 1", "Item 2"] };

		await processCheckboxes(mockFlow, mockBlock, "somePath", mockParams);

		const expectedCheckboxes = { items: ["Item 1", "Item 2"], min: 1, max: 2 };
		expect(mockParams.injectMessage).toHaveBeenCalled();
		const [content] = (mockParams.injectMessage as jest.Mock).mock.calls[0];
		expect(content.props.checkboxes).toMatchObject(expectedCheckboxes);
	});

	it("should handle invalid min/max values", async () => {
		mockBlock.checkboxes = { items: ["Item 1", "Item 2"], min: 3, max: 2 };

		await processCheckboxes(mockFlow, mockBlock, "somePath", mockParams);

		const expectedCheckboxes = { items: ["Item 1", "Item 2"], min: 2, max: 2 };
		expect(mockParams.injectMessage).toHaveBeenCalled();
		const [content] = (mockParams.injectMessage as jest.Mock).mock.calls[0];
		console.log("content.props.checkboxes:", content.props.checkboxes);
		console.log("expectedCheckboxes:", expectedCheckboxes);

		expect(content.props.checkboxes).toMatchObject(expectedCheckboxes);
	});

	it("should not inject message if no items are present in checkboxes", async () => {
		mockBlock.checkboxes = { items: [] };

		await processCheckboxes(mockFlow, mockBlock, "somePath", mockParams);

		expect(mockParams.injectMessage).not.toHaveBeenCalled();
	});
});
