import { renderHook, act } from "@testing-library/react";
import { expect } from "@jest/globals";

import { syncVoiceWithChatInput } from "../../../src/services/VoiceService";
import { useVoiceInternal } from "../../../src/hooks/internal/useVoiceInternal";
import { useDispatchRcbEventInternal } from "../../../src/hooks/internal/useDispatchRcbEventInternal";
import { RcbEvent } from "../../../src/constants/RcbEvent";

import { TestChatBotProvider } from "../../__mocks__/TestChatBotContext";
import { MockDefaultSettings } from "../../__mocks__/constants";

// mocks internal hooks and services
jest.mock("../../../src/hooks/internal/useDispatchRcbEventInternal");
jest.mock("../../../src/services/VoiceService");
const mockUseRcbEventInternal = useDispatchRcbEventInternal as jest.MockedFunction<typeof useDispatchRcbEventInternal>;
const mockSyncVoiceWithChatInput = syncVoiceWithChatInput as jest.MockedFunction<typeof syncVoiceWithChatInput>;

/**
 * Test for useVoiceInternal hook.
 */
describe("useVoiceInternal Hook", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	// initial values
	const initialVoiceToggledOn = MockDefaultSettings.voice?.defaultToggledOn;

	it("should toggle voice correctly, change state and emit rcb-toggle-voice event", async () => {
		// mocks rcb event handler
		const dispatchRcbEventMock = jest.fn().mockReturnValue({ defaultPrevented: false });
		mockUseRcbEventInternal.mockReturnValue({
			dispatchRcbEvent: dispatchRcbEventMock,
		});

		// renders the hook within the TestChatBotProvider
		const { result } = renderHook(() => useVoiceInternal(), {
			wrapper: TestChatBotProvider,
		});

		// checks initial value
		expect(result.current.voiceToggledOn).toBe(initialVoiceToggledOn);

		// simulates clicking the toggle action
		await act(async () => {
			await result.current.toggleVoice();
		});

		// checks if dispatchRcbEvent was called with rcb-toggle-voice and correct arguments
		expect(dispatchRcbEventMock).toHaveBeenCalledWith(RcbEvent.TOGGLE_VOICE, {
			currState: initialVoiceToggledOn,
			newState: !initialVoiceToggledOn,
		});

		// checks if voice state was updated
		expect(result.current.voiceToggledOn).toBe(!initialVoiceToggledOn);

		// simulates clicking the toggle action
		await act(async () => {
			await result.current.toggleVoice();
		});

		// checks if dispatchRcbEvent was called with rcb-toggle-audio and correct arguments
		expect(dispatchRcbEventMock).toHaveBeenCalledWith(RcbEvent.TOGGLE_VOICE, {
			currState: !initialVoiceToggledOn,
			newState: initialVoiceToggledOn,
		});

		// check if voice state was updated
		expect(result.current.voiceToggledOn).toBe(initialVoiceToggledOn);
	});

	it("should prevent toggling when event is defaultPrevented", () => {
		// mocks rcb event handler
		const dispatchRcbEventMock = jest.fn().mockReturnValue({ defaultPrevented: true });
		mockUseRcbEventInternal.mockReturnValue({
			dispatchRcbEvent: dispatchRcbEventMock,
		});

		// renders the hook within the TestChatBotProvider
		const { result } = renderHook(() => useVoiceInternal(), {
			wrapper: TestChatBotProvider,
		});

		// checks initial value
		expect(result.current.voiceToggledOn).toBe(initialVoiceToggledOn);

		// simulates clicking the toggle action
		act(() => {
			result.current.toggleVoice();
		});

		// checks if dispatchRcbEvent was called with rcb-toggle-voice and correct arguments
		expect(dispatchRcbEventMock).toHaveBeenCalledWith(RcbEvent.TOGGLE_VOICE, {
			currState: initialVoiceToggledOn,
			newState: !initialVoiceToggledOn,
		});

		// checks if voice state stayed the same
   		expect(result.current.voiceToggledOn).toBe(initialVoiceToggledOn);
  	});

	it("should call syncVoiceWithChatInput with correct parameters", () => {
		// renders the hook within the TestChatBotProvider
		const { result } = renderHook(() => useVoiceInternal(), {
			wrapper: TestChatBotProvider,
		});

		// calls syncVoice with true
		act(() => {
			result.current.syncVoice(true);
		});

		// checks if syncVoiceWithChatInput was called with true and settings
		expect(mockSyncVoiceWithChatInput).toHaveBeenCalledWith(true, MockDefaultSettings);

		// calls syncVoice with false
		act(() => {
			result.current.syncVoice(false);
		});

		// checks if syncVoiceWithChatInput was called with false and settings
		expect(mockSyncVoiceWithChatInput).toHaveBeenCalledWith(false, MockDefaultSettings);
	});
});
