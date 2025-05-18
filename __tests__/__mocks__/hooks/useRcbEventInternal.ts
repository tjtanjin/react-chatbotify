export const useDispatchRcbEventInternal = jest.fn(() => ({
	dispatchRcbEvent: jest.fn().mockReturnValue({ defaultPrevented: false }),
}));