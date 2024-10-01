import { renderHook, act } from "@testing-library/react";

import { useAudioInternal } from "../../src/hooks/internal/useAudioInternal";
import { useRcbEventInternal } from "../../src/hooks/internal/useRcbEventInternal";
import { RcbEvent } from "../../src/constants/RcbEvent";

import { TestChatBotProvider } from "../__mocks__/TestChatBotProvider";
import { MockDefaultSettings } from "../__mocks__/constants";

// mocks internal hooks
jest.mock("../../src/hooks/internal/useRcbEventInternal");
const mockUseRcbEventInternal = useRcbEventInternal as jest.MockedFunction<typeof useRcbEventInternal>;

/**
 * Test for useAudioInternal hook.
 */
describe("useAudioInternal Hook", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});
	
	// initial values
	const initialAudioToggledOn = MockDefaultSettings.audio?.defaultToggledOn;
	
	it("should toggle audio correctly, change state and emit rcb-toggle-audio event", () => {
		// mocks rcb event handler
		const callRcbEventMock = jest.fn().mockReturnValue({ defaultPrevented: false });
		mockUseRcbEventInternal.mockReturnValue({
			callRcbEvent: callRcbEventMock,
		});

		// renders the hook within the TestChatBotProvider
		const { result } = renderHook(() => useAudioInternal(), {
			wrapper: TestChatBotProvider,
		});

		// checks initial value
		expect(result.current.audioToggledOn).toBe(initialAudioToggledOn);

		// simulates clicking the toggle action
		act(() => {
			result.current.toggleAudio();
		});

		// checks if callRcbEvent was called with rcb-toggle-audio and correct arguments
		expect(callRcbEventMock).toHaveBeenCalledWith(RcbEvent.TOGGLE_AUDIO, {
			currState: initialAudioToggledOn,
			newState: !initialAudioToggledOn,
		});

		// checks if audio state was updated
		expect(result.current.audioToggledOn).toBe(!initialAudioToggledOn);
	});

	it("should prevent toggling when event is defaultPrevented", () => {
		// mocks rcb event handler
		const callRcbEventMock = jest.fn().mockReturnValue({ defaultPrevented: true });
		mockUseRcbEventInternal.mockReturnValue({
			callRcbEvent: callRcbEventMock,
		});

		// renders the hook within the TestChatBotProvider
		const { result } = renderHook(() => useAudioInternal(), {
			wrapper: TestChatBotProvider,
		});

		// checks initial state
		expect(result.current.audioToggledOn).toBe(initialAudioToggledOn);

		// simulates clicking the toggle action
		act(() => {
			result.current.toggleAudio();
		});

		// checks if callRcbEvent was called with rcb-toggle-audio and correct arguments
		expect(callRcbEventMock).toHaveBeenCalledWith(RcbEvent.TOGGLE_AUDIO, {
			currState: initialAudioToggledOn,
			newState: !initialAudioToggledOn,
		});

    	// checks if audio state stayed the same
   		expect(result.current.audioToggledOn).toBe(initialAudioToggledOn);
  	});
});
