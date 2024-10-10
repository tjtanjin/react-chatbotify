import { postProcessBlock } from "../../../src/services/BlockService/BlockService";
import { processTransition } from "../../../src/services/BlockService/TransitionProcessor";
import { Flow } from "../../../src/types/Flow";
import { Params } from "../../../src/types/Params";


jest.mock('../../../src/services/BlockService/BlockService', () => ({
	postProcessBlock: jest.fn(),
}));

describe('processTransition', () => {
	let flow: Flow;
	let params: Params;
	let goToPath: jest.Mock;
	let setTimeoutId: jest.Mock;

	beforeEach(() => {
		flow = {} as Flow;
		params = {} as Params;
		goToPath = jest.fn();
		setTimeoutId = jest.fn();
		jest.useFakeTimers();
	});

	afterEach(() => {
		jest.clearAllTimers();
		jest.resetAllMocks();
	});

	it('should throw an error if block is not valid', async () => {
		await expect(processTransition(flow, 'invalidPath' as keyof Flow, params, goToPath, setTimeoutId))
			.rejects
			.toThrow('block is not valid.');
	});

	it('should handle transition attribute as a function returning a promise', async () => {
		const transitionAttr = jest.fn(() => Promise.resolve({ duration: 1000, interruptable: true }));
		flow['validPath'] = { transition: transitionAttr };

		await processTransition(flow, 'validPath' as keyof Flow, params, goToPath, setTimeoutId);

		jest.runAllTimers();

		expect(transitionAttr).toHaveBeenCalledWith(params);
		expect(postProcessBlock).toHaveBeenCalledWith(flow, 'validPath', params, goToPath);
		expect(setTimeoutId).toHaveBeenCalled();
	});

	it('should handle transition attribute as a function returning a value', async () => {
		const transitionAttr = jest.fn(() => ({ duration: 1000, interruptable: true }));
		flow['validPath'] = { transition: transitionAttr };

		await processTransition(flow, 'validPath' as keyof Flow, params, goToPath, setTimeoutId);

		jest.runAllTimers();

		expect(transitionAttr).toHaveBeenCalledWith(params);
		expect(postProcessBlock).toHaveBeenCalledWith(flow, 'validPath', params, goToPath);
		expect(setTimeoutId).toHaveBeenCalled();
	});

	it('should handle transition attribute as a number', async () => {
		flow['validPath'] = { transition: 1000 };

		await processTransition(flow, 'validPath' as keyof Flow, params, goToPath, setTimeoutId);

		jest.runAllTimers();

		expect(postProcessBlock).toHaveBeenCalledWith(flow, 'validPath', params, goToPath);
		expect(setTimeoutId).not.toHaveBeenCalled();
	});

	it('should handle transition attribute as an object with duration and interruptable properties', async () => {
		flow['validPath'] = { transition: { duration: 1000, interruptable: true } };

		await processTransition(flow, 'validPath' as keyof Flow, params, goToPath, setTimeoutId);

		jest.runAllTimers();

		expect(postProcessBlock).toHaveBeenCalledWith(flow, 'validPath', params, goToPath);
		expect(setTimeoutId).toHaveBeenCalled();
	});

	it('should not transition if transition details are not present', async () => {
		flow['validPath'] = { };

		await processTransition(flow, 'validPath' as keyof Flow, params, goToPath, setTimeoutId);

		jest.runAllTimers();

		expect(postProcessBlock).not.toHaveBeenCalled();
	});
});