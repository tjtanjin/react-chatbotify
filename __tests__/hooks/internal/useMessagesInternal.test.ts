import { renderHook } from "@testing-library/react";
import { act } from "react";
import { useMessagesInternal } from "../../../src/hooks/internal/useMessagesInternal";
import { useSettingsContext } from "../../../src/context/SettingsContext";
import { useMessagesContext } from "../../../src/context/MessagesContext";
import { useBotStatesContext } from "../../../src/context/BotStatesContext";
import { useBotRefsContext } from "../../../src/context/BotRefsContext";
import { useRcbEventInternal } from "../../../src/hooks/internal/useRcbEventInternal";
import { Message } from "../../../src/types/Message";

jest.mock("../../../src/context/SettingsContext");
jest.mock("../../../src/context/MessagesContext");
jest.mock("../../../src/context/BotStatesContext");
jest.mock("../../../src/context/BotRefsContext");
jest.mock("../../../src/hooks/internal/useRcbEventInternal");
jest.mock("../../../src/services/AudioService");
jest.mock("../../../src/services/ChatHistoryService");

describe("useMessagesInternal", () => {
  const mockSetMessages = jest.fn();
  const mockSetIsBotTyping = jest.fn();
  const mockSetUnreadCount = jest.fn();
  const mockCallRcbEvent = jest.fn();
  const mockStreamMessageMap = { current: new Map() };
  const mockMessages: Message[] = [];

  beforeEach(() => {
    jest.clearAllMocks();
    (useSettingsContext as jest.Mock).mockReturnValue({
      settings: {
        botBubble: { dangerouslySetInnerHtml: false, simStream: false },
        userBubble: { dangerouslySetInnerHtml: false, simStream: false },
        event: {},
      },
    });
    (useMessagesContext as jest.Mock).mockReturnValue({
      messages: mockMessages,
      setMessages: mockSetMessages,
    });
    (useBotStatesContext as jest.Mock).mockReturnValue({
      audioToggledOn: false,
      isChatWindowOpen: true,
      setIsBotTyping: mockSetIsBotTyping,
      setUnreadCount: mockSetUnreadCount,
    });
    (useBotRefsContext as jest.Mock).mockReturnValue({
      streamMessageMap: mockStreamMessageMap,
    });
    (useRcbEventInternal as jest.Mock).mockReturnValue({
      callRcbEvent: mockCallRcbEvent,
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
      const messageId = await result.current.injectMessage("Test message", "BOT");
      expect(messageId).toBeTruthy();
    });

    expect(mockSetMessages).toHaveBeenCalled();
    expect(mockSetUnreadCount).toHaveBeenCalledWith(expect.any(Function));
  });

  it("should remove a message correctly", async () => {
    const mockMessageId = "test-id";
    const mockMessage: Message = { id: mockMessageId, content: "Test", sender: "BOT", type: "text",
        timestamp: String(Date.now()) };
    (useMessagesContext as jest.Mock).mockReturnValue({
      messages: [mockMessage],
      setMessages: mockSetMessages,
    });

    const { result } = renderHook(() => useMessagesInternal());

    await act(async () => {
      const removedId = await result.current.removeMessage(mockMessageId);
      expect(removedId).toBe(mockMessageId);
    });

    expect(mockSetMessages).toHaveBeenCalled();
    expect(mockSetUnreadCount).toHaveBeenCalledWith(expect.any(Function));
  });

  it("should stream a message correctly", async () => {
    const { result } = renderHook(() => useMessagesInternal());

    await act(async () => {
      const messageId = await result.current.streamMessage("Test stream", "BOT");
      expect(messageId).toBeTruthy();
    });

    expect(mockSetMessages).toHaveBeenCalled();
    expect(mockSetUnreadCount).toHaveBeenCalledWith(expect.any(Function));
    expect(mockStreamMessageMap.current.has("BOT")).toBeTruthy();
  });

  it("should end stream message correctly", async () => {
    mockStreamMessageMap.current.set("BOT", "test-id");
    const { result } = renderHook(() => useMessagesInternal());

    await act(async () => {
      const success = await result.current.endStreamMessage("BOT");
      expect(success).toBeTruthy();
    });

    expect(mockStreamMessageMap.current.has("BOT")).toBeFalsy();
  });

});