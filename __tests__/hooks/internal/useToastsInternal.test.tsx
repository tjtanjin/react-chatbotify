// Import required testing utilities and hooks
import { renderHook, act } from "@testing-library/react";
import { useToastsInternal } from '../../../src/hooks/internal/useToastsInternal';
import { useSettingsContext } from '../../../src/context/SettingsContext';
import { useToastsContext } from '../../../src/context/ToastsContext';
import { useRcbEventInternal } from '../../../src/hooks/internal/useRcbEventInternal';
import { RcbEvent } from '../../../src/constants/RcbEvent';
import { generateSecureUUID } from '../../../src/utils/idGenerator';

// Mock dependencies used in the tests
jest.mock('../../../src/context/SettingsContext');
jest.mock('../../../src/context/ToastsContext');
jest.mock('../../../src/hooks/internal/useRcbEventInternal');
jest.mock('../../../src/utils/idGenerator', () => ({
	generateSecureUUID: jest.fn(),
}));

// Define types for mock contexts and events
type MockSettingsContextType = { 
    settings: { toast: { 
        maxCount: number; forbidOnMax: boolean; }; 
        event: { rcbShowToast: boolean; rcbDismissToast: boolean; };};};
type MockToastsContextType = {
    toasts: Array<{ id: string; content?: string }>; 
    setToasts: jest.Mock; }; 
type MockRcbEventInternalType = { callRcbEvent: jest.Mock;};


describe('useToastsInternal', () => {
	let mockSettingsContext: MockSettingsContextType; 
	let mockToastsContext: MockToastsContextType; 
	let mockRcbEventInternal: MockRcbEventInternalType

	beforeEach(() => {
		// Set up mock settings and contexts before each test
		mockSettingsContext = {
			settings: {
				toast: { maxCount: 3, forbidOnMax: true },
				event: {
					rcbShowToast: true,
					rcbDismissToast: true,
				}
			}
		};
		(useSettingsContext as jest.Mock).mockReturnValue(mockSettingsContext);

		mockToastsContext = {
			toasts: [],
			setToasts: jest.fn(),
		};
		(useToastsContext as jest.Mock).mockReturnValue(mockToastsContext);

		mockRcbEventInternal = {
			callRcbEvent: jest.fn(),
		};
		(useRcbEventInternal as jest.Mock).mockReturnValue(mockRcbEventInternal);

		(generateSecureUUID as jest.Mock).mockReturnValue('mocked-uuid');
	});

	afterEach(() => {
		// Clear mocks after each test
		jest.clearAllMocks();
	});

	it('should add a new toast when not exceeding maxCount', async () => {
		// Test adding a toast when maxCount is not reached
		mockRcbEventInternal.callRcbEvent.mockReturnValue({ defaultPrevented: false, 
			data: { toast: { id: 'mocked-uuid', content: 'New toast content', timeout: undefined } 
			} });
		const { result } = renderHook(() => useToastsInternal());
		await act(async () => {
			await result.current.showToast('New toast content');
		});
		expect(generateSecureUUID).toHaveBeenCalled();
		expect(mockToastsContext.setToasts).toHaveBeenCalledWith(expect.any(Function));
        
		// Verify that the toast was added
		const setToastsFn = mockToastsContext.setToasts.mock.calls[0][0];
		const newToasts = setToastsFn([]);
		expect(newToasts).toEqual([{ id: 'mocked-uuid', content: 'New toast content', timeout: undefined }]);
	});

	it('should not add a new toast if maxCount is reached and forbidOnMax is true', async () => {
		// Test forbidding new toast if maxCount is reached
		mockToastsContext.toasts = [{ id: '1' }, { id: '2' }, { id: '3' }];
		const { result } = renderHook(() => useToastsInternal());
		const toastId = await result.current.showToast('Toast content');
		expect(toastId).toBeNull();
		expect(mockToastsContext.setToasts).not.toHaveBeenCalled();
	});

	it('should remove the oldest toast and add a new one if maxCount is reached but forbidOnMax is false', async () => {
		// Test replacing oldest toast if maxCount reached and forbidOnMax is false
		mockSettingsContext.settings.toast.forbidOnMax = false;
		mockToastsContext.toasts = [{ id: '1' }, { id: '2' }, { id: '3' }];
		mockRcbEventInternal.callRcbEvent.mockReturnValue({ 
			defaultPrevented: false, data: { toast: { id: 'mocked-uuid', 
				content: 'New toast content', timeout: undefined } 
			} });
		const { result } = renderHook(() => useToastsInternal());
		await act(async () => {
			await result.current.showToast('New toast content');
		});
		expect(mockToastsContext.setToasts).toHaveBeenCalledWith(expect.any(Function));
        
		// Verify the oldest toast was removed and new one added
		const setToastsFn = mockToastsContext.setToasts.mock.calls[0][0];
		const newToasts = setToastsFn([{ id: '1' }, { id: '2' }, { id: '3' }]);
		expect(newToasts).toEqual([
			{ id: '2' },
			{ id: '3' },
			{ id: 'mocked-uuid', content: 'New toast content', timeout: undefined },
		]);
	});

	it('should dismiss a toast by id', async () => {
		// Test dismissing a toast by ID
		const toast = { id: 'toast-1', content: 'Toast to dismiss' };
		mockToastsContext.toasts = [toast];
		mockRcbEventInternal.callRcbEvent.mockReturnValue({ defaultPrevented: false });
		const { result } = renderHook(() => useToastsInternal());
		await act(async () => {
			await result.current.dismissToast('toast-1');
		});
		expect(mockToastsContext.setToasts).toHaveBeenCalledWith(expect.any(Function));
        
		// Verify toast was dismissed
		const setToastsFn = mockToastsContext.setToasts.mock.calls[0][0];
		const updatedToasts = setToastsFn([toast]);
		expect(updatedToasts).toEqual([]);
	});

	it('should not dismiss a toast if the id is not found', async () => {
		// Test no dismissal if ID not found
		mockToastsContext.toasts = [{ id: 'toast-2', content: 'Another toast' }];
		const { result } = renderHook(() => useToastsInternal());
		const resultId = await result.current.dismissToast('invalid-id');
		expect(resultId).toBeNull();
		expect(mockToastsContext.setToasts).not.toHaveBeenCalled();
	});

	it('should not show toast if rcbShowToast event is prevented', async () => {
		// Test prevention of toast display by event
		mockRcbEventInternal.callRcbEvent.mockReturnValue({ defaultPrevented: true });
		const { result } = renderHook(() => useToastsInternal());
		const resultId = await result.current.showToast('Prevented toast');
		expect(resultId).toBeNull();
		expect(mockToastsContext.setToasts).not.toHaveBeenCalled();
	});

	it('should call rcbDismissToast event when dismissing a toast', async () => {
		// Test triggering of dismiss event upon toast removal
		const toast = { id: 'toast-1', content: 'Toast to dismiss' };
		mockToastsContext.toasts = [toast];
		mockRcbEventInternal.callRcbEvent.mockReturnValue({ defaultPrevented: false });
		const { result } = renderHook(() => useToastsInternal());
		await act(async () => {
			await result.current.dismissToast('toast-1');
		});
		expect(mockRcbEventInternal.callRcbEvent).toHaveBeenCalledWith(RcbEvent.DISMISS_TOAST, { toast });
	});
});
