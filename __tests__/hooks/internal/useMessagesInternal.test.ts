import { renderHook } from "@testing-library/react";
import { act } from "react";
import { useMessagesInternal } from "../../../src/hooks/internal/useMessagesInternal";
import { useSettingsContext } from "../../../src/context/SettingsContext";
import { useMessagesContext } from "../../../src/context/MessagesContext";
import { useBotStatesContext } from "../../../src/context/BotStatesContext";
import { useBotRefsContext } from "../../../src/context/BotRefsContext";
import { useDispatchRcbEventInternal } from "../../../src/hooks/internal/useDispatchRcbEventInternal";
import { Message } from "../../../src/types/Message";

jest.mock("../../../src/context/SettingsContext");
jest.mock("../../../src/context/MessagesContext");
jest.mock("../../../src/context/BotStatesContext");
jest.mock("../../../src/context/BotRefsContext");
jest.mock("../../../src/hooks/internal/useDispatchRcbEventInternal");
jest.mock("../../../src/services/AudioService");
jest.mock("../../../src/services/ChatHistoryService");

describe("useMessagesInternal", () => {
	const setSyncedMessagesMock = jest.fn();
	const mockSetSyncedIsBotTyping = jest.fn();
	const mockSetUnreadCount = jest.fn();
	const mockCallRcbEvent = jest.fn();
	const mockStreamMessageMap = { current: new Map() };
	const mockMessages: Message[] = [];
	const mockMessagesSyncRef = { current: mockMessages };
	const mockSyncedIsScrollingRef = { current: false };
	const mockSyncedIsChatWindowOpenRef = { current: false };
	const mockSyncedNotificationsToggledOnRef = { current: false };
	const mockChatBodyRef = { current: null };

	beforeEach(() => {
		jest.clearAllMocks();

		(useSettingsContext as jest.Mock).mockReturnValue({
			settings: {
				botBubble: { dangerouslySetInnerHtml: false, simulateStream: false },
				userBubble: { dangerouslySetInnerHtml: false, simulateStream: false },
				event: {},
			},
		});

		(useMessagesContext as jest.Mock).mockReturnValue({
			messages: mockMessages,
			setSyncedMessages: setSyncedMessagesMock,
			syncedMessagesRef: mockMessagesSyncRef,
		});

		(useBotStatesContext as jest.Mock).mockReturnValue({
			audioToggledOn: false,
			isChatWindowOpen: true,
			setSyncedIsBotTyping: mockSetSyncedIsBotTyping,
			setUnreadCount: mockSetUnreadCount,
			syncedIsScrollingRef: mockSyncedIsScrollingRef,
			syncedIsChatWindowOpenRef: mockSyncedIsChatWindowOpenRef,
			syncedNotificationsToggledOnRef: mockSyncedNotificationsToggledOnRef,
		});

		(useBotRefsContext as jest.Mock).mockReturnValue({
			streamMessageMap: mockStreamMessageMap,
			chatBodyRef: mockChatBodyRef,
		});

		(useDispatchRcbEventInternal as jest.Mock).mockReturnValue({
			dispatchRcbEvent: mockCallRcbEvent,
		});
	});

	it("should return expected functions and values", () => {
		const { result } = renderHook(() => useMessagesInternal());

		expect(result.current).toHaveProperty("endStreamMessage");
		expect(result.current).toHaveProperty("injectMessage");
		expect(result.current).toHaveProperty("removeMessage");
		expect(result.current).toHaveProperty("streamMessage");
		expect(result.current).toHaveProperty("messages");
		expect(result.current).toHaveProperty("replaceMessages");
	});

	it("should inject a message correctly", async () => {
		const { result } = renderHook(() => useMessagesInternal());

		await act(async () => {
			const message = await result.current.injectMessage("Test message", "BOT");
			expect(message).toBeTruthy();
		});

		expect(setSyncedMessagesMock).toHaveBeenCalledWith(expect.any(Function));
		expect(mockSetUnreadCount).toHaveBeenCalledWith(expect.any(Function));
	});

	it("should remove a message correctly", async () => {
		const mockMessageId = "test-id";
		const mockMessage: Message = {
			id: mockMessageId,
			content: "Test",
			sender: "BOT",
			type: "text",
			timestamp: String(Date.now()),
			tags: [],
		};

		(useMessagesContext as jest.Mock).mockReturnValue({
			messages: [mockMessage],
			setSyncedMessages: setSyncedMessagesMock,
			syncedMessagesRef: { current: [mockMessage] },
		});

		const { result } = renderHook(() => useMessagesInternal());

		await act(async () => {
			const removed = await result.current.removeMessage(mockMessageId);
			expect(removed).toBe(mockMessage);
		});

		expect(setSyncedMessagesMock).toHaveBeenCalledWith(expect.any(Function));
		expect(mockSetUnreadCount).toHaveBeenCalledWith(expect.any(Function));
	});

	it("should stream a message correctly", async () => {
		const { result } = renderHook(() => useMessagesInternal());

		await act(async () => {
			const message = await result.current.streamMessage("Test stream", "BOT");
			expect(message).toBeTruthy();
		});

		expect(setSyncedMessagesMock).toHaveBeenCalledWith(expect.any(Function));
		expect(mockSetUnreadCount).toHaveBeenCalledWith(expect.any(Function));
		expect(mockStreamMessageMap.current.has("BOT")).toBeTruthy();
	});

	it("should end stream message correctly", async () => {
		const message: Message = {
			id: "test-id",
			content: "streaming...",
			sender: "BOT",
			type: "text",
			timestamp: String(Date.now()),
			tags: [],
		};

		mockStreamMessageMap.current.set("BOT", message.id);

		(useMessagesContext as jest.Mock).mockReturnValue({
			messages: [message],
			setSyncedMessages: setSyncedMessagesMock,
			syncedMessagesRef: { current: [message] },
		});

		const { result } = renderHook(() => useMessagesInternal());

		await act(async () => {
			const success = await result.current.endStreamMessage("BOT");
			expect(success).toBeTruthy();
		});

		expect(mockStreamMessageMap.current.has("BOT")).toBeFalsy();
	});
});
