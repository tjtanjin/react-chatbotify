import { renderHook, act } from "@testing-library/react";
import { usePathsInternal } from "../../../src/hooks/internal/usePathsInternal";
import { useSettingsContext } from "../../../src/context/SettingsContext";
import { usePathsContext } from "../../../src/context/PathsContext";
import { useBotStatesContext } from "../../../src/context/BotStatesContext";
import { useBotRefsContext } from "../../../src/context/BotRefsContext";
import { emitRcbEvent } from "../../../src/services/RcbEventService";
import { RcbEvent } from "../../../src/constants/RcbEvent";

// Mock the necessary contexts and services
jest.mock("../../../src/context/SettingsContext");
jest.mock("../../../src/context/PathsContext");
jest.mock("../../../src/context/BotStatesContext");
jest.mock("../../../src/context/BotRefsContext");
jest.mock("../../../src/services/RcbEventService");

describe("usePathsInternal Hook", () => {
  const mockSetPaths = jest.fn();
  const mockSetIsBotTyping = jest.fn();
  const mockSetTextAreaDisabled = jest.fn();
  const mockSetTextAreaSensitiveMode = jest.fn();
  const mockSetBlockAllowsAttachment = jest.fn();
  const mockBotIdRef = { current: "bot-1" };
  const mockPaths = ["path1", "path2"];

  beforeEach(() => {
    jest.clearAllMocks();
    (useSettingsContext as jest.Mock).mockReturnValue({
      settings: {
        event: { rcbChangePath: true },
        chatInput: { blockSpam: true },
      },
    });
    (usePathsContext as jest.Mock).mockReturnValue({
      paths: mockPaths,
      setPaths: mockSetPaths,
    });
    (useBotStatesContext as jest.Mock).mockReturnValue({
      setIsBotTyping: mockSetIsBotTyping,
      setTextAreaDisabled: mockSetTextAreaDisabled,
      setTextAreaSensitiveMode: mockSetTextAreaSensitiveMode,
      blockAllowsAttachment: false,
      setBlockAllowsAttachment: mockSetBlockAllowsAttachment,
    });
    (useBotRefsContext as jest.Mock).mockReturnValue({
      botIdRef: mockBotIdRef,
    });

    // Mock emitRcbEvent to return an object with defaultPrevented
    (emitRcbEvent as jest.Mock).mockReturnValue({
      defaultPrevented: false,
    });
  });

 it("should go to a new path and emit the rcbChangePath event", async () => {
  const { result } = renderHook(() => usePathsInternal());

  await act(async () => {
    const success = await result.current.goToPath("newPath");
    expect(success).toBe(true);
  });

  // Check that mockSetPaths was called with a function
  expect(mockSetPaths).toHaveBeenCalledWith(expect.any(Function));

  // Simulate calling the function with previous state
  const setPathsCallback = mockSetPaths.mock.calls[0][0]; // Get the first call's first argument
  const newState = setPathsCallback(mockPaths); // Simulate previous state being passed to the function

  // Check that the function returns the correct new state
  expect(newState).toEqual([...mockPaths, "newPath"]);

  expect(mockSetIsBotTyping).toHaveBeenCalledWith(true);
  expect(mockSetTextAreaDisabled).toHaveBeenCalledWith(true);
  expect(mockSetTextAreaSensitiveMode).toHaveBeenCalledWith(false);
  expect(emitRcbEvent).toHaveBeenCalledWith(
    RcbEvent.CHANGE_PATH,
    { botId: mockBotIdRef.current, currPath: "path2", prevPath: "path1" },
    { currPath: "path2", prevPath: "path1", nextPath: "newPath" }
  );
});


  it("should prevent going to a new path if the event is defaultPrevented", async () => {
    // Mocking the event being prevented
    (emitRcbEvent as jest.Mock).mockReturnValue({ defaultPrevented: true });

    const { result } = renderHook(() => usePathsInternal());

    await act(async () => {
      const success = await result.current.goToPath("blockedPath");
      expect(success).toBe(false);
    });

    expect(mockSetPaths).not.toHaveBeenCalled();
  });
});
