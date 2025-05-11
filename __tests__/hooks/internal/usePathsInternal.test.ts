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
	const mockSetSyncedPaths = jest.fn();
	const mockSetSyncedIsBotTyping = jest.fn();
	const mockSetTextAreaDisabled = jest.fn();
	const mockSetTextAreaSensitiveMode = jest.fn();
	const mockSetBlockAllowsAttachment = jest.fn();
	const mockBotIdRef = { current: "bot-1" };
	const mockFlowRef = { current: { id: "test-flow" } };
	const mockSyncedPathsRef = { current: ["path1", "path2"] };
	const mockSyncedIsScrollingRef = { current: false };
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
			setSyncedPaths: mockSetSyncedPaths,
			syncedPathsRef: mockSyncedPathsRef,
		});
		(useBotStatesContext as jest.Mock).mockReturnValue({
			setSyncedIsBotTyping: mockSetSyncedIsBotTyping,
			setSyncedTextAreaDisabled: mockSetTextAreaDisabled,
			setSyncedTextAreaSensitiveMode: mockSetTextAreaSensitiveMode,
			blockAllowsAttachment: false,
			setBlockAllowsAttachment: mockSetBlockAllowsAttachment,
		});
		(useBotRefsContext as jest.Mock).mockReturnValue({
			botIdRef: mockBotIdRef,
			flowRef: mockFlowRef,
			syncedPathsRef: mockSyncedPathsRef,
			syncedIsScrollingRef: mockSyncedIsScrollingRef,
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

		// Check that mockSetSyncedPaths was called with a function
		expect(mockSetSyncedPaths).toHaveBeenCalledWith(expect.any(Function));

		// Simulate calling the function with previous state
		const setSyncedPathsCallback = mockSetSyncedPaths.mock.calls[0][0]; // Get the first call's first argument
		const newState = setSyncedPathsCallback(mockPaths); // Simulate previous state being passed to the function

		// Check that the function returns the correct new state
		expect(newState).toEqual([...mockPaths, "newPath"]);

		// todo: shift to block processing test cases when they are added
		// expect(mockSetSyncedIsBotTyping).toHaveBeenCalledWith(true);
		// expect(mockSetTextAreaDisabled).toHaveBeenCalledWith(true);
		// expect(mockSetTextAreaSensitiveMode).toHaveBeenCalledWith(false);
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

		expect(mockSetSyncedPaths).not.toHaveBeenCalled();
	});
});
