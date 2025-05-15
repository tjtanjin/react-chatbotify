import { renderHook, act } from "@testing-library/react";
import { useFlowInternal } from "../../../src/hooks/internal/useFlowInternal";

// Mock all the contexts that are used by useFlowInternal
import { useMessagesContext } from "../../../src/context/MessagesContext";
import { usePathsContext } from "../../../src/context/PathsContext";
import { useToastsContext } from "../../../src/context/ToastsContext";
import { useBotStatesContext } from "../../../src/context/BotStatesContext";
import { useBotRefsContext } from "../../../src/context/BotRefsContext";
import { useSettingsContext } from "../../../src/context/SettingsContext";
import { setHistoryStorageValues } from "../../../src/services/ChatHistoryService";

jest.mock("../../../src/context/MessagesContext");
jest.mock("../../../src/context/PathsContext");
jest.mock("../../../src/context/ToastsContext");
jest.mock("../../../src/context/BotStatesContext");
jest.mock("../../../src/context/BotRefsContext");
jest.mock("../../../src/context/SettingsContext");
jest.mock("../../../src/services/ChatHistoryService");

describe("useFlowInternal Hook", () => {
	const mockTimeoutIdRef = { current: null };
	const setSyncedMessagesMock = jest.fn();
	const setSyncedPathsMock = jest.fn();
	const setSyncedToastsMock = jest.fn();
	const setSyncedIsBotTypingMock = jest.fn();
	const flowRefMock = { current: { id: "test-flow" } };
	const syncedPathsRefMock = { current: ["start"] };
	const syncedIsScrollingRefMock = { current: false };
	const hasFlowStartedMock = true;
	const mockSettings = {
		chatHistory: {
			storageType: "localStorage",
			storageKey: "rcb-history",
		},
	};

	beforeEach(() => {
		jest.clearAllMocks();

		(useMessagesContext as jest.Mock).mockReturnValue({
			setSyncedMessages: setSyncedMessagesMock,
		});
		(usePathsContext as jest.Mock).mockReturnValue({
			setSyncedPaths: setSyncedPathsMock,
			syncedPathsRef: syncedPathsRefMock,
		});
		(useToastsContext as jest.Mock).mockReturnValue({ setSyncedToasts: setSyncedToastsMock });
		(useBotRefsContext as jest.Mock).mockReturnValue({
			flowRef: flowRefMock,
			timeoutIdRef: mockTimeoutIdRef,
			syncedIsScrollingRef: syncedIsScrollingRefMock,
		});
		(useBotStatesContext as jest.Mock).mockReturnValue({
			hasFlowStarted: hasFlowStartedMock,
			setSyncedIsBotTyping: setSyncedIsBotTypingMock,
		});
		(useSettingsContext as jest.Mock).mockReturnValue({ settings: mockSettings });
	});

	// Test to ensure initial values (hasFlowStarted and flowRef) are returned correctly from the hook
	it("should return initial values from context", () => {
		const { result } = renderHook(() => useFlowInternal());

		expect(result.current.hasFlowStarted).toBe(true);
		expect(result.current.getFlow()).toEqual({ id: "test-flow" });
	});

	// Test to ensure that restartFlow clears messages, toasts, and resets paths
	it("should restart the flow by clearing messages, toasts, resetting paths and loading history", async () => {
		const { result } = renderHook(() => useFlowInternal());

		await act(async () => {
			await result.current.restartFlow();
		});

		expect(setSyncedMessagesMock).toHaveBeenCalledWith([]);
		expect(setSyncedToastsMock).toHaveBeenCalledWith([]);
		expect(typeof setSyncedPathsMock.mock.calls[1][0]).toBe("function");
		const updaterFn = setSyncedPathsMock.mock.calls[1][0];
		const output = updaterFn([]);
		expect(output).toEqual(["start"]);
		expect(setHistoryStorageValues).toHaveBeenCalledWith({
			chatHistory: {
				storageType: "localStorage",
				storageKey: "rcb-history",
			},
		});
	});

	// Test to ensure that getFlow returns the current flow from flowRef
	it("should get the current flow from flowRef", () => {
		const { result } = renderHook(() => useFlowInternal());

		const flow = result.current.getFlow();
		expect(flow).toEqual({ id: "test-flow" });
	});

	// Test to ensure that calling restartFlow multiple times works correctly
	it("should handle multiple restarts correctly", async () => {
		const { result } = renderHook(() => useFlowInternal());

		await act(async () => {
			await result.current.restartFlow();
		});

		await act(async () => {
			await result.current.restartFlow();
		});

		expect(setSyncedMessagesMock).toHaveBeenCalledTimes(2);
		expect(setSyncedToastsMock).toHaveBeenCalledTimes(2);
		expect(setSyncedPathsMock).toHaveBeenCalledTimes(4);
	});

	// Test to check flow state when hasFlowStarted is false
	it("should correctly reflect flow state when it hasn't started", () => {
		(useBotStatesContext as jest.Mock).mockReturnValue({ hasFlowStarted: false });
		const { result } = renderHook(() => useFlowInternal());

		expect(result.current.hasFlowStarted).toBe(false);
	});

	// Test to ensure messages, toasts, and paths are initialized correctly when restarting the flow
	it("should initialize messages, toasts, and paths correctly", async () => {
		const { result } = renderHook(() => useFlowInternal());

		await act(async () => {
			await result.current.restartFlow();
		});

		expect(setSyncedMessagesMock).toHaveBeenCalledWith([]);
		expect(setSyncedToastsMock).toHaveBeenCalledWith([]);
		expect(typeof setSyncedPathsMock.mock.calls[1][0]).toBe("function");
		const updaterFn = setSyncedPathsMock.mock.calls[1][0];
		const output = updaterFn([]);
		expect(output).toEqual(["start"]);
	});

	// Test to check that getFlow returns different flowRef values correctly
	it("should handle different flowRef values", () => {
		const differentFlowRefMock = { current: { id: "different-flow" } };
		(useBotRefsContext as jest.Mock).mockReturnValue({
			flowRef: differentFlowRefMock,
			syncedIsScrollingRef: syncedIsScrollingRefMock,
		});
		const { result } = renderHook(() => useFlowInternal());

		const flow = result.current.getFlow();
		expect(flow).toEqual({ id: "different-flow" });
	});
});
