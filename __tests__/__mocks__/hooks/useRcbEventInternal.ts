export const useRcbEventInternal = jest.fn(() => ({
	dispatchRcbEvent: jest.fn().mockReturnValue({ defaultPrevented: false }),
}));