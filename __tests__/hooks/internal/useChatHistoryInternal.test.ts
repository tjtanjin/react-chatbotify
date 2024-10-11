import { renderHook, act } from "@testing-library/react";
import { expect } from "@jest/globals";

import { getHistoryMessages, loadChatHistory } from "../../../src/services/ChatHistoryService";
import { generateSecureUUID } from "../../../src/utils/idGenerator";
import { useChatHistoryInternal } from "../../../src/hooks/internal/useChatHistoryInternal";
import { useRcbEventInternal } from "../../../src/hooks/internal/useRcbEventInternal";
import { RcbEvent } from "../../../src/constants/RcbEvent";

import { TestChatBotProvider } from "../../__mocks__/TestChatBotContext";
import { MockDefaultSettings } from "../../__mocks__/constants";

// mocks internal hooks and services
jest.mock("../../../src/hooks/internal/useRcbEventInternal");
const mockUseRcbEventInternal = useRcbEventInternal as jest.MockedFunction<typeof useRcbEventInternal>;
jest.mock("../../../src/services/ChatHistoryService");
const mockGetHistoryMessages = getHistoryMessages as jest.MockedFunction<typeof getHistoryMessages>;
const mockLoadChatHistory = loadChatHistory as jest.MockedFunction<typeof loadChatHistory>;

/**
 * Test for useChatHistoryInternal hook.
 */
describe("useChatHistoryInternal Hook", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	// initial values
	const initialIsLoadingChatHistory = false;
	const initialChatHistory = [
		{
			id: generateSecureUUID(),
			sender: "user",
			content: "Hello",
			type: "string",
			timestamp: new Date().toUTCString()
		},
		{
			id: generateSecureUUID(),
			sender: "bot",
			content: "Hi there!",
			type: "string",
			timestamp: new Date().toUTCString()
		},
	];

	it("should load chat history correctly, change state and emit rcb-load-chat-history event", async () => {
		// mocks rcb event handler
		const callRcbEventMock = jest.fn().mockReturnValue({ defaultPrevented: false });
		mockUseRcbEventInternal.mockReturnValue({
			callRcbEvent: callRcbEventMock,
		});

		// mocks getHistoryMessages to return initialChatHistory
		mockGetHistoryMessages.mockReturnValue(initialChatHistory);

		// mocks loadChatHistory to resolve successfully
		mockLoadChatHistory.mockImplementation(
			(settings, styles, chatHistory, setMessages) => {
				setMessages(chatHistory);
				return Promise.resolve();
			}
		);

		// renders the hook within the TestChatBotProvider
		const { result } = renderHook(() => useChatHistoryInternal(), {
			wrapper: TestChatBotProvider,
		});

		// checks initial value
		expect(result.current.isLoadingChatHistory).toBe(initialIsLoadingChatHistory);

		// simulates clicking on load chat history button
		act(() => {
			result.current.showChatHistory();
		});

		// checks if loading state is true
		expect(result.current.isLoadingChatHistory).toBe(true);

		// checks if get history messages was called
		expect(mockGetHistoryMessages).toHaveBeenCalledTimes(1);

		// checks if callRcbEvent was called with rcb-load-chat-history and correct arguments
		expect(callRcbEventMock).toHaveBeenCalledWith(RcbEvent.LOAD_CHAT_HISTORY, {});

		// checks if load chat history was called
		expect(mockLoadChatHistory).toHaveBeenCalledWith(
			MockDefaultSettings,
			expect.any(Object),
			initialChatHistory,
			expect.any(Function),
		);

		// checks if history is being loaded
		expect(result.current.isLoadingChatHistory).toBe(true);
	});

	it("should prevent loading when LOAD_CHAT_HISTORY event is defaultPrevented", async () => {
		// mocks rcb event handler
		const callRcbEventMock = jest.fn().mockReturnValue({ defaultPrevented: true });
		mockUseRcbEventInternal.mockReturnValue({
			callRcbEvent: callRcbEventMock,
		});

		// mocks getHistoryMessages to return initialChatHistory
		mockGetHistoryMessages.mockReturnValue(initialChatHistory);

		// renders the hook within the TestChatBotProvider
		const { result } = renderHook(() => useChatHistoryInternal(), {
			wrapper: TestChatBotProvider,
		});

		// check initial values
		expect(result.current.isLoadingChatHistory).toBe(initialIsLoadingChatHistory);

		// simulates clicking on load chat history button
		act(() => {
			result.current.showChatHistory();
		});

		// checks if get history messages was called
		expect(mockGetHistoryMessages).toHaveBeenCalledTimes(1);

		// checks if callRcbEvent was called with rcb-load-chat-history and correct arguments
		expect(callRcbEventMock).toHaveBeenCalledWith(RcbEvent.LOAD_CHAT_HISTORY, {});

		// checks if load chat history was not called
		expect(mockLoadChatHistory).not.toHaveBeenCalled();

		// checks if history is being loaded
		expect(result.current.isLoadingChatHistory).toBe(false);
	});
});
