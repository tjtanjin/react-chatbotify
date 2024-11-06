import { renderHook, act } from "@testing-library/react";
import { expect } from "@jest/globals";

import { useChatWindowInternal } from "../../../src/hooks/internal/useChatWindowInternal";
import { useRcbEventInternal } from "../../../src/hooks/internal/useRcbEventInternal";
import { RcbEvent } from "../../../src/constants/RcbEvent";

import { TestChatBotProvider } from "../../__mocks__/TestChatBotContext";
import { MockDefaultSettings } from "../../__mocks__/constants";

// mocks internal hooks and services
jest.mock("../../../src/hooks/internal/useRcbEventInternal");
const mockUseRcbEventInternal = useRcbEventInternal as jest.MockedFunction<typeof useRcbEventInternal>;

/**
 * Test for useChatWindowInternal hook.
 */
describe("useChatWindowInternal Hook", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	// initial values
	const initialChatWindowOpen = MockDefaultSettings.chatWindow?.defaultOpen;

	it("should toggle chat window correctly, change state and emit rcb-toggle-chat-window event", async () => {
		// mocks rcb event handler
		const callRcbEventMock = jest.fn().mockReturnValue({ defaultPrevented: false });
		mockUseRcbEventInternal.mockReturnValue({
			callRcbEvent: callRcbEventMock,
		});

		// renders the hook within the TestChatBotProvider
		const { result } = renderHook(() => useChatWindowInternal(), {
			wrapper: TestChatBotProvider
		});

		// checks initial value
		expect(result.current.isChatWindowOpen).toBe(initialChatWindowOpen);

		// simulates clicking the toggle action
		await act(async () => {
			await result.current.toggleChatWindow();
		});

		// checks if callRcbEvent was called with rcb-toggle-chat-window and correct arguments
		expect(callRcbEventMock).toHaveBeenCalledWith(RcbEvent.TOGGLE_CHAT_WINDOW, {
			currState: initialChatWindowOpen,
			newState: !initialChatWindowOpen,
		});

		// check if chat window state was updated
		expect(result.current.isChatWindowOpen).toBe(!initialChatWindowOpen);

		// simulates clicking the toggle action
		await act(async () => {
			await result.current.toggleChatWindow();
		});

		// checks if callRcbEvent was called with rcb-toggle-chat-window and correct arguments
		expect(callRcbEventMock).toHaveBeenCalledWith(RcbEvent.TOGGLE_CHAT_WINDOW, {
			currState: !initialChatWindowOpen,
			newState: initialChatWindowOpen,
		});

		// check if chat window state was updated
		expect(result.current.isChatWindowOpen).toBe(initialChatWindowOpen);
	});

	it("should prevent toggling when event is defaultPrevented", async () => {
		// mocks rcb event handler
		const callRcbEventMock = jest.fn().mockReturnValue({ defaultPrevented: true });
		mockUseRcbEventInternal.mockReturnValue({
			callRcbEvent: callRcbEventMock,
		});

		// renders the hook within the TestChatBotProvider
		const { result } = renderHook(() => useChatWindowInternal(), {
			wrapper: TestChatBotProvider
		});

		// checks initial value
		expect(result.current.isChatWindowOpen).toBe(initialChatWindowOpen);

		// simulates clicking the toggle action
		await act(async () => {
			await result.current.toggleChatWindow();
		});

		// checks if callRcbEvent was called with rcb-toggle-chat-window and correct arguments
		expect(callRcbEventMock).toHaveBeenCalledWith(RcbEvent.TOGGLE_CHAT_WINDOW, {
			currState: initialChatWindowOpen,
			newState: !initialChatWindowOpen,
		});

		// checks if chat window state stayed the same
		expect(result.current.isChatWindowOpen).toBe(initialChatWindowOpen);
	});

	it("should call openChat with correct parameters to open and close the chat window", async () => {
		// mocks rcb event handler
		const callRcbEventMock = jest.fn().mockReturnValue({ defaultPrevented: false });
		mockUseRcbEventInternal.mockReturnValue({
			callRcbEvent: callRcbEventMock,
		});

		// renders the hook within the TestChatBotProvider
		const { result } = renderHook(() => useChatWindowInternal(), {
			wrapper: TestChatBotProvider
		});

		// checks initial value
		expect(result.current.isChatWindowOpen).toBe(initialChatWindowOpen);

		// opens the chat window
		await act(async () => {
			await result.current.openChat(true);
		});

		// checks if callRcbEvent was called with rcb-toggle-chat-window and correct arguments
		expect(callRcbEventMock).toHaveBeenCalledWith(RcbEvent.TOGGLE_CHAT_WINDOW, {
			currState: initialChatWindowOpen,
			newState: !initialChatWindowOpen,
		});

		// checks if chat window state was updated
		expect(result.current.isChatWindowOpen).toBe(!initialChatWindowOpen);

		// closes the chat window
		await act(async () => {
			await result.current.openChat(false);
		});

		// checks if callRcbEvent was called with rcb-toggle-chat-window and correct arguments
		expect(callRcbEventMock).toHaveBeenCalledWith(RcbEvent.TOGGLE_CHAT_WINDOW, {
			currState: result.current.isChatWindowOpen,
			newState: !result.current.isChatWindowOpen,
		});

		// checks if chat window state was updated
		expect(result.current.isChatWindowOpen).toBe(initialChatWindowOpen);
	});
});
