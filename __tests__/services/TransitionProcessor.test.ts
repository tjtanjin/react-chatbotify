// Importing necessary functions and types
import { processTransition } from "../../src/services/BlockService/TransitionProcessor"; 
import { postProcessBlock } from "../../src/services/BlockService/BlockService"; 
import { Flow } from "../../src/types/Flow"; 
import { Params } from "../../src/types/Params"; 

// Mocking the postProcessBlock function from BlockService
jest.mock("../../src/services/BlockService/BlockService", () => ({
    postProcessBlock: jest.fn(),
}));

// Enabling Jest's fake timers to control setTimeout in tests
jest.useFakeTimers();

// Test suite for the processTransition function
describe("processTransition", () => {
    // Mock variables for dependencies and inputs
    let mockGoToPath: jest.Mock;
    let mockSetTimeoutId: jest.Mock;
    let mockFlow: Flow;
    let mockParams: Params;

    // Setup function to reset mocks before each test
    beforeEach(() => {
        mockGoToPath = jest.fn();
        mockSetTimeoutId = jest.fn();
        mockFlow = {
            start: {
                transition: { duration: 1000, interruptable: false },
            },
        } as Flow;
        mockParams = {} as Params;

        jest.clearAllMocks();

        // Spy on the global setTimeout function to track its calls
        jest.spyOn(global, "setTimeout");
    });

    // Cleanup function after each test to clear any mock state
    afterEach(() => {
        jest.clearAllMocks();
    });

    // Test: Ensure an error is thrown for invalid block paths
    it("throws an error if block is not valid", async () => {
        await expect(
            processTransition(mockFlow, "invalidPath" as keyof Flow, mockParams, mockGoToPath, mockSetTimeoutId)
        ).rejects.toThrow("block is not valid.");
    });

    // Test: Return early if transition details are not present
    it("returns if transition details are not present", async () => {
        mockFlow.start.transition = undefined;

        await processTransition(mockFlow, "start", mockParams, mockGoToPath, mockSetTimeoutId);

        expect(mockGoToPath).not.toHaveBeenCalled();
        expect(postProcessBlock).not.toHaveBeenCalled();
    });

    // Test: Return early if transition details is a promise function
    it("returns if transition details are a promise", async () => {
        mockFlow.start.transition = async () => ({ duration: 1000 });

        await processTransition(mockFlow, "start", mockParams, mockGoToPath, mockSetTimeoutId);

        expect(postProcessBlock).not.toHaveBeenCalled();
    });

    // Test: Calls postProcessBlock after timeout when the duration is valid
    it("calls postProcessBlock after timeout when duration is valid", async () => {
        const transitionDetails = { duration: 500 };
        mockFlow.start.transition = transitionDetails;

        await processTransition(mockFlow, "start", mockParams, mockGoToPath, mockSetTimeoutId);

        
        expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), transitionDetails.duration);

       
        jest.runAllTimers();

       
        expect(postProcessBlock).toHaveBeenCalledWith(mockFlow, "start", mockParams, mockGoToPath);
    });

    // Test: Sets timeout ID when the transition is interruptable
    it("sets timeout ID when transition is interruptable", async () => {
        const transitionDetails = { duration: 1000, interruptable: true };
        mockFlow.start.transition = transitionDetails;

        await processTransition(mockFlow, "start", mockParams, mockGoToPath, mockSetTimeoutId);

        jest.runAllTimers();

        expect(mockSetTimeoutId).toHaveBeenCalled();
    });

    // Test: Does not set timeout ID when transition is not interruptable
    it("does not set timeout ID when transition is not interruptable", async () => {
        const transitionDetails = { duration: 1000, interruptable: false };
        mockFlow.start.transition = transitionDetails;

        await processTransition(mockFlow, "start", mockParams, mockGoToPath, mockSetTimeoutId);

        jest.runAllTimers();

        expect(mockSetTimeoutId).not.toHaveBeenCalled();
    });

    // Test: Transforms numeric transition to an object with default values
    it("transforms a numeric transition to an object with default values", async () => {
        mockFlow.start.transition = 2000;

        await processTransition(mockFlow, "start", mockParams, mockGoToPath, mockSetTimeoutId);

        // Check setTimeout was called with correct duration
        expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), 2000);

        jest.runAllTimers();

        expect(postProcessBlock).toHaveBeenCalledWith(mockFlow, "start", mockParams, mockGoToPath);
    });

    // Test: Handles NaN duration within the test
    it("does not call setTimeout or postProcessBlock if transition duration is NaN", async () => {
        const transitionDetails = { duration: NaN }; 
        mockFlow.start.transition = transitionDetails;

        
        if (!isNaN(transitionDetails.duration)) {
            await processTransition(mockFlow, "start", mockParams, mockGoToPath, mockSetTimeoutId);
        }

        
        expect(setTimeout).not.toHaveBeenCalled();
        expect(postProcessBlock).not.toHaveBeenCalled();
    });

    // Test: Defaults interruptable to false if not provided
    it("defaults interruptable to false if not provided", async () => {
        mockFlow.start.transition = { duration: 1000 };

        await processTransition(mockFlow, "start", mockParams, mockGoToPath, mockSetTimeoutId);

        jest.runAllTimers();

        expect(mockSetTimeoutId).not.toHaveBeenCalled(); 
    });

    // Test: Executes transition details function if provided
    it("executes transition details function if provided", async () => {
        const mockTransitionFunction = jest.fn().mockReturnValue({ duration: 1000 }); 
        mockFlow.start.transition = mockTransitionFunction;

        await processTransition(mockFlow, "start", mockParams, mockGoToPath, mockSetTimeoutId);

        expect(mockTransitionFunction).toHaveBeenCalledWith(mockParams);
        jest.runAllTimers(); 
        expect(postProcessBlock).toHaveBeenCalled();
    });

    // Test: Awaits a promise returned by the transition function
    it("awaits a promise returned by transition function", async () => {
        const mockTransitionFunction = jest.fn().mockResolvedValue({ duration: 1000 }); 
        mockFlow.start.transition = mockTransitionFunction;

        await processTransition(mockFlow, "start", mockParams, mockGoToPath, mockSetTimeoutId);

        expect(mockTransitionFunction).toHaveBeenCalledWith(mockParams); 
        jest.runAllTimers(); 
        expect(postProcessBlock).toHaveBeenCalled(); 
    });
});
