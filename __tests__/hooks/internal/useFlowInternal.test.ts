import { renderHook, act } from "@testing-library/react";
import { useFlowInternal } from "../../../src/hooks/internal/useFlowInternal";

// Mock all the contexts that are used by useFlowInternal
import { useMessagesContext } from "../../../src/context/MessagesContext";
import { usePathsContext } from "../../../src/context/PathsContext";
import { useToastsContext } from "../../../src/context/ToastsContext";
import { useBotStatesContext } from "../../../src/context/BotStatesContext";
import { useBotRefsContext } from "../../../src/context/BotRefsContext";

jest.mock("../../../src/context/MessagesContext");
jest.mock("../../../src/context/PathsContext");
jest.mock("../../../src/context/ToastsContext");
jest.mock("../../../src/context/BotStatesContext");
jest.mock("../../../src/context/BotRefsContext");

describe("useFlowInternal Hook", () => {
	const setMessagesMock = jest.fn();
  const setPathsMock = jest.fn();
	const setToastsMock = jest.fn();
  const flowRefMock = { current: { id: "test-flow" } };
  const hasFlowStartedMock = true;

  beforeEach(() => {
    jest.clearAllMocks();


    (useMessagesContext as jest.Mock).mockReturnValue({ setMessages: setMessagesMock });
    (usePathsContext as jest.Mock).mockReturnValue({ setPaths: setPathsMock });
    (useToastsContext as jest.Mock).mockReturnValue({ setToasts: setToastsMock });
    (useBotRefsContext as jest.Mock).mockReturnValue({ flowRef: flowRefMock });
    (useBotStatesContext as jest.Mock).mockReturnValue({ hasFlowStarted: hasFlowStartedMock });
  });


// Test to ensure initial values (hasFlowStarted and flowRef) are returned correctly from the hook
  it("should return initial values from context", () => {
    const { result } = renderHook(() => useFlowInternal());

    expect(result.current.hasFlowStarted).toBe(true);
    expect(result.current.getFlow()).toEqual({ id: "test-flow" });
  });

 // Test to ensure that restartFlow clears messages, toasts, and resets paths
  it("should restart the flow by clearing messages, toasts, and resetting paths", () => {
    const { result } = renderHook(() => useFlowInternal());

    act(() => {
      result.current.restartFlow();
    });

    expect(setMessagesMock).toHaveBeenCalledWith([]);
    expect(setToastsMock).toHaveBeenCalledWith([]);
    expect(setPathsMock).toHaveBeenCalledWith(["start"]);
  });

// Test to ensure that getFlow returns the current flow from flowRef
  it("should get the current flow from flowRef", () => {
    const { result } = renderHook(() => useFlowInternal());

    const flow = result.current.getFlow();
    expect(flow).toEqual({ id: "test-flow" });
  });

// Test to ensure that calling restartFlow multiple times works correctly
  it("should handle multiple restarts correctly", () => {
    const { result } = renderHook(() => useFlowInternal());

    act(() => {
      result.current.restartFlow();
    });

    act(() => {
      result.current.restartFlow();
    });

    expect(setMessagesMock).toHaveBeenCalledTimes(2);
    expect(setToastsMock).toHaveBeenCalledTimes(2);
    expect(setPathsMock).toHaveBeenCalledTimes(2);
  });

// Test to check flow state when hasFlowStarted is false
  it("should correctly reflect flow state when it hasn't started", () => {
    (useBotStatesContext as jest.Mock).mockReturnValue({ hasFlowStarted: false });
    const { result } = renderHook(() => useFlowInternal());

    expect(result.current.hasFlowStarted).toBe(false);
  });

// Test to ensure messages, toasts, and paths are initialized correctly when restarting the flow
  it("should initialize messages, toasts, and paths correctly", () => {
    const { result } = renderHook(() => useFlowInternal());

    act(() => {
      result.current.restartFlow();
    });

    expect(setMessagesMock).toHaveBeenCalledWith([]);
    expect(setToastsMock).toHaveBeenCalledWith([]);
    expect(setPathsMock).toHaveBeenCalledWith(["start"]);
  });

// Test to check that getFlow returns different flowRef values correctly
  it("should handle different flowRef values", () => {
    const differentFlowRefMock = { current: { id: "different-flow" } };
    (useBotRefsContext as jest.Mock).mockReturnValue({ flowRef: differentFlowRefMock });
    const { result } = renderHook(() => useFlowInternal());

    const flow = result.current.getFlow();
    expect(flow).toEqual({ id: "different-flow" });
  });
});