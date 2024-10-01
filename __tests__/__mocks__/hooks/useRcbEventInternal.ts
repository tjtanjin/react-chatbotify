export const useRcbEventInternal = jest.fn(() => ({
	callRcbEvent: jest.fn().mockReturnValue({ defaultPrevented: false }),
}));