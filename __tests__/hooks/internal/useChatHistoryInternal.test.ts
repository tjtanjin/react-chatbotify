import { renderHook, act } from "@testing-library/react";
import { expect } from "@jest/globals";

import {
	getHistoryMessages,
	loadChatHistory,
} from "../../../src/services/ChatHistoryService";
import { generateSecureUUID } from "../../../src/utils/idGenerator";
import { useChatHistoryInternal } from "../../../src/hooks/internal/useChatHistoryInternal";
import { useDispatchRcbEventInternal } from "../../../src/hooks/internal/useDispatchRcbEventInternal";
import { RcbEvent } from "../../../src/constants/RcbEvent";

import { TestChatBotProvider } from "../../__mocks__/TestChatBotContext";
import { MockDefaultSettings } from "../../__mocks__/constants";

// mocks internal hooks and services
jest.mock("../../../src/hooks/internal/useDispatchRcbEventInternal");
const mockUseRcbEventInternal = useDispatchRcbEventInternal as jest.MockedFunction<
	typeof useDispatchRcbEventInternal
>;
jest.mock("../../../src/services/ChatHistoryService");
const mockGetHistoryMessages = getHistoryMessages as jest.MockedFunction<
	typeof getHistoryMessages
>;
const mockLoadChatHistory = loadChatHistory as jest.MockedFunction<
	typeof loadChatHistory
>;

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
			sender: "USER",
			content: "Hello",
			type: "string",
			timestamp: new Date().toUTCString(),
			tags: [],
		},
		{
			id: generateSecureUUID(),
			sender: "BOT",
			content: "Hi there!",
			type: "string",
			timestamp: new Date().toUTCString(),
			tags: [],
		},
	];

	it("should load chat history correctly, change state and emit rcb-load-chat-history event", async () => {
		// mocks rcb event handler
		const dispatchRcbEventMock = jest.fn().mockResolvedValue({ defaultPrevented: false });
		mockUseRcbEventInternal.mockReturnValue({
			dispatchRcbEvent: dispatchRcbEventMock,
		});

		// mocks getHistoryMessages to return initialChatHistory
		mockGetHistoryMessages.mockReturnValue(initialChatHistory);

		// mocks loadChatHistory to simulate success and invoke setSyncedMessages
		mockLoadChatHistory.mockImplementation(
			(settings, styles, chatHistory, setSyncedMessages) => {
				// simulate state change
				setSyncedMessages(chatHistory);
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
		await act(async () => {
			await result.current.showChatHistory();
		});

		// checks if get history messages was called
		expect(mockGetHistoryMessages).toHaveBeenCalledTimes(1);

		// checks if dispatchRcbEvent was called with rcb-load-chat-history and correct arguments
		expect(dispatchRcbEventMock).toHaveBeenCalledWith(RcbEvent.LOAD_CHAT_HISTORY, {});

		// checks if load chat history was called
		expect(mockLoadChatHistory).toHaveBeenCalledWith(
			MockDefaultSettings,
			expect.any(Object), // styles
			initialChatHistory,
			expect.any(Function), // setSyncedMessages
			expect.any(Object), // syncedMessagesRef
			expect.any(Object), // chatBodyRef
			expect.any(Number), // scroll height
			expect.any(Function), // setLoading
			expect.any(Function)  // setHasLoaded
		);

		// isLoadingChatHistory should be true while load is in progress
		expect(result.current.isLoadingChatHistory).toBe(true);
	});

	it("should prevent loading when LOAD_CHAT_HISTORY event is defaultPrevented", async () => {
		// mocks rcb event handler
		const dispatchRcbEventMock = jest.fn().mockResolvedValue({ defaultPrevented: true });
		mockUseRcbEventInternal.mockReturnValue({
			dispatchRcbEvent: dispatchRcbEventMock,
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
		await act(async () => {
			await result.current.showChatHistory();
		});

		// checks if get history messages was called
		expect(mockGetHistoryMessages).toHaveBeenCalledTimes(1);

		// checks if dispatchRcbEvent was called with rcb-load-chat-history and correct arguments
		expect(dispatchRcbEventMock).toHaveBeenCalledWith(RcbEvent.LOAD_CHAT_HISTORY, {});

		// checks if load chat history was not called
		expect(mockLoadChatHistory).not.toHaveBeenCalled();

		// checks that isLoadingChatHistory remains unchanged
		expect(result.current.isLoadingChatHistory).toBe(false);
	});
});
