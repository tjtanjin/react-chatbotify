import { renderHook, act } from "@testing-library/react";
import { expect } from "@jest/globals";

import { useAudioInternal } from "../../../src/hooks/internal/useAudioInternal";
import { useDispatchRcbEventInternal } from "../../../src/hooks/internal/useDispatchRcbEventInternal";
import { RcbEvent } from "../../../src/constants/RcbEvent";

import { TestChatBotProvider } from "../../__mocks__/TestChatBotContext";
import { MockDefaultSettings } from "../../__mocks__/constants";

// mocks internal hooks
jest.mock("../../../src/hooks/internal/useDispatchRcbEventInternal");
const mockUseRcbEventInternal = useDispatchRcbEventInternal as jest.MockedFunction<typeof useDispatchRcbEventInternal>;

/**
 * Test for useAudioInternal hook.
 */
describe("useAudioInternal Hook", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});
	
	// initial values
	const initialAudioToggledOn = MockDefaultSettings.audio?.defaultToggledOn;
	
	it("should toggle audio correctly, change state and emit rcb-toggle-audio event", async () => {
		// mocks rcb event handler
		const dispatchRcbEventMock = jest.fn().mockReturnValue({ defaultPrevented: false });
		mockUseRcbEventInternal.mockReturnValue({
			dispatchRcbEvent: dispatchRcbEventMock,
		});

		// renders the hook within the TestChatBotProvider
		const { result } = renderHook(() => useAudioInternal(), {
			wrapper: TestChatBotProvider,
		});

		// checks initial value
		expect(result.current.audioToggledOn).toBe(initialAudioToggledOn);

		// simulates clicking the toggle action
		await act(async () => {
			await result.current.toggleAudio();
		});

		// checks if dispatchRcbEvent was called with rcb-toggle-audio and correct arguments
		expect(dispatchRcbEventMock).toHaveBeenCalledWith(RcbEvent.TOGGLE_AUDIO, {
			currState: initialAudioToggledOn,
			newState: !initialAudioToggledOn,
		});

		// checks if audio state was updated
		expect(result.current.audioToggledOn).toBe(!initialAudioToggledOn);

		// simulates clicking the toggle action
		await act(async () => {
			await result.current.toggleAudio();
		});

		// checks if dispatchRcbEvent was called with rcb-toggle-audio and correct arguments
		expect(dispatchRcbEventMock).toHaveBeenCalledWith(RcbEvent.TOGGLE_AUDIO, {
			currState: !initialAudioToggledOn,
			newState: initialAudioToggledOn,
		});

		// check if audio state was updated
		expect(result.current.audioToggledOn).toBe(initialAudioToggledOn);
	});

	it("should prevent toggling when event is defaultPrevented", async () => {
		// mocks rcb event handler
		const dispatchRcbEventMock = jest.fn().mockReturnValue({ defaultPrevented: true });
		mockUseRcbEventInternal.mockReturnValue({
			dispatchRcbEvent: dispatchRcbEventMock,
		});

		// renders the hook within the TestChatBotProvider
		const { result } = renderHook(() => useAudioInternal(), {
			wrapper: TestChatBotProvider,
		});

		// checks initial state
		expect(result.current.audioToggledOn).toBe(initialAudioToggledOn);

		// simulates clicking the toggle action
		await act(async () => {
			await result.current.toggleAudio();
		});

		// checks if dispatchRcbEvent was called with rcb-toggle-audio and correct arguments
		expect(dispatchRcbEventMock).toHaveBeenCalledWith(RcbEvent.TOGGLE_AUDIO, {
			currState: initialAudioToggledOn,
			newState: !initialAudioToggledOn,
		});

    	// checks if audio state stayed the same
   		expect(result.current.audioToggledOn).toBe(initialAudioToggledOn);
  	});

	// todo: add test case to test speakAudio as well
});