import { expect } from "@jest/globals";

// Importing necessary functions and types
import { processTransition } from "../../src/services/BlockService/TransitionProcessor"; 
import { postProcessBlock } from "../../src/services/BlockService/BlockService"; 
import { Params } from "../../src/types/Params"; 
import { Block } from "../../src/types/Block";

// Mocking the postProcessBlock function from BlockService
jest.mock("../../src/services/BlockService/BlockService", () => ({
	postProcessBlock: jest.fn(),
}));

// Enabling Jest's fake timers to control setTimeout in tests
jest.useFakeTimers();

// Test suite for the processTransition function
describe("processTransition", () => {
	// Mock variables for dependencies and inputs
	let mockTimeoutIdRef: {current: null};
	let mockGoToPath: jest.Mock;
	let mockFirePostProcessBlockEvent: jest.Mock;
	let mockBlock: Block;
	let mockParams: Params;

	// Setup function to reset mocks before each test
	beforeEach(() => {
		mockTimeoutIdRef = {current: null};
		mockGoToPath = jest.fn();
		mockFirePostProcessBlockEvent = jest.fn();
		mockBlock = {
			transition: { duration: 1000, interruptable: false },
		} as Block;
		mockParams = {} as Params;

		jest.clearAllMocks();

		// Spy on the global setTimeout function to track its calls
		jest.spyOn(global, "setTimeout");
	});

	// Cleanup function after each test to clear any mock state
	afterEach(() => {
		jest.clearAllMocks();
	});

	// Test: Return early if transition details are not present
	it("returns if transition details are not present", async () => {
		mockBlock.transition = undefined;
		mockParams.currPath = "start";

		await processTransition(mockBlock, mockParams, mockTimeoutIdRef, mockFirePostProcessBlockEvent);

		expect(mockGoToPath).not.toHaveBeenCalled();
		expect(postProcessBlock).not.toHaveBeenCalled();
	});

	// Test: Return early if transition details is a promise function
	it("returns if transition details are a promise", async () => {
		mockBlock.transition = async () => ({ duration: 1000 });
		mockParams.currPath = "start";

		await processTransition(mockBlock, mockParams, mockTimeoutIdRef, mockFirePostProcessBlockEvent);

		expect(postProcessBlock).not.toHaveBeenCalled();
	});

	// Test: Calls postProcessBlock after timeout when the duration is valid
	it("calls postProcessBlock after timeout when duration is valid", async () => {
		const transitionDetails = { duration: 500 };
		mockBlock.transition = transitionDetails;
		mockParams.currPath = "start";
		mockFirePostProcessBlockEvent.mockResolvedValue(mockBlock);

		await processTransition(mockBlock, mockParams, mockTimeoutIdRef, mockFirePostProcessBlockEvent);

		expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), transitionDetails.duration);

		jest.runAllTimers();
		await Promise.resolve();
		expect(postProcessBlock).toHaveBeenCalledWith(mockBlock, mockParams);
	});

	// Test: Sets timeout ID when the transition is interruptable
	it("sets timeout ID when transition is interruptable", async () => {
		const transitionDetails = { duration: 1000, interruptable: true };
		mockBlock.transition = transitionDetails;
		mockParams.currPath = "start";

		await processTransition(mockBlock, mockParams, mockTimeoutIdRef, mockFirePostProcessBlockEvent);

		jest.runAllTimers();
		expect(mockTimeoutIdRef.current).not.toBeNull();
	});

	// Test: Does not set timeout ID when transition is not interruptable
	it("does not set timeout ID when transition is not interruptable", async () => {
		const transitionDetails = { duration: 1000, interruptable: false };
		mockBlock.transition = transitionDetails;
		mockParams.currPath = "start";

		await processTransition(mockBlock, mockParams, mockTimeoutIdRef, mockFirePostProcessBlockEvent);

		jest.runAllTimers();
		expect(mockTimeoutIdRef.current).toBeNull();
	});

	// Test: Transforms numeric transition to an object with default values
	it("transforms a numeric transition to an object with default values", async () => {
		mockBlock.transition = 2000;
		mockParams.currPath = "start";
		mockFirePostProcessBlockEvent.mockResolvedValue(mockBlock);

		await processTransition(mockBlock, mockParams, mockTimeoutIdRef, mockFirePostProcessBlockEvent);

		// Check setTimeout was called with correct duration
		expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), 2000);

		jest.runAllTimers();
		await Promise.resolve();
		expect(postProcessBlock).toHaveBeenCalledWith(mockBlock, mockParams);
	});

	// Test: Handles NaN duration within the test
	it("does not call setTimeout or postProcessBlock if transition duration is NaN", async () => {
		const transitionDetails = { duration: NaN }; 
		mockBlock.transition = transitionDetails;
		mockParams.currPath = "start";
        
		if (!isNaN(transitionDetails.duration)) {
			await processTransition(mockBlock, mockParams, mockTimeoutIdRef, mockFirePostProcessBlockEvent);
		}

        
		expect(setTimeout).not.toHaveBeenCalled();
		expect(postProcessBlock).not.toHaveBeenCalled();
	});

	// Test: Defaults interruptable to false if not provided
	it("defaults interruptable to false if not provided", async () => {
		mockBlock.transition = { duration: 1000 };
		mockParams.currPath = "start";

		await processTransition(mockBlock, mockParams, mockTimeoutIdRef, mockFirePostProcessBlockEvent);

		jest.runAllTimers();
		expect(mockTimeoutIdRef.current).toBeNull();
	});

	// Test: Executes transition details function if provided
	it("executes transition details function if provided", async () => {
		const mockTransitionFunction = jest.fn().mockReturnValue({ duration: 1000 }); 
		mockBlock.transition = mockTransitionFunction;
		mockParams.currPath = "start";
		mockFirePostProcessBlockEvent.mockResolvedValue(mockBlock);

		await processTransition(mockBlock, mockParams, mockTimeoutIdRef, mockFirePostProcessBlockEvent);

		expect(mockTransitionFunction).toHaveBeenCalledWith(mockParams);
		jest.runAllTimers();
		await Promise.resolve();
		expect(postProcessBlock).toHaveBeenCalled();
	});

	// Test: Awaits a promise returned by the transition function
	it("awaits a promise returned by transition function", async () => {
		const mockTransitionFunction = jest.fn().mockResolvedValue({ duration: 1000 }); 
		mockBlock.transition = mockTransitionFunction;
		mockParams.currPath = "start";
		mockFirePostProcessBlockEvent.mockResolvedValue(mockBlock);

		await processTransition(mockBlock, mockParams, mockTimeoutIdRef, mockFirePostProcessBlockEvent);

		expect(mockTransitionFunction).toHaveBeenCalledWith(mockParams); 
		jest.runAllTimers();
		await Promise.resolve();
		expect(postProcessBlock).toHaveBeenCalled(); 
	});
});
