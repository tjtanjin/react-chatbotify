import { renderHook, act } from "@testing-library/react";
import { expect } from "@jest/globals";

import { useNotificationInternal } from "../../../src/hooks/internal/useNotificationsInternal";
import { useRcbEventInternal } from "../../../src/hooks/internal/useRcbEventInternal";
import { RcbEvent } from "../../../src/constants/RcbEvent";

import { TestChatBotProvider } from "../../__mocks__/TestChatBotContext";
import { MockDefaultSettings } from "../../__mocks__/constants";

// mocks internal hooks and services
jest.mock("../../../src/hooks/internal/useRcbEventInternal");
const mockUseRcbEventInternal = useRcbEventInternal as jest.MockedFunction<typeof useRcbEventInternal>;

/**
 * Test for useNotificationsInternal hook.
 */
describe("useNotificationsInternal Hook", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	// initial values
	const initialNotificationsToggledOn = MockDefaultSettings.notification?.defaultToggledOn;

	it("should toggle notifications correctly, change state and emit rcb-toggle-notifications event", async () => {
		// mocks rcb event handler
		const callRcbEventMock = jest.fn().mockReturnValue({ defaultPrevented: false });
		mockUseRcbEventInternal.mockReturnValue({
			callRcbEvent: callRcbEventMock,
		});

		// renders the hook within the TestChatBotProvider
		const { result } = renderHook(() => useNotificationInternal(), {
			wrapper: TestChatBotProvider
		});

		// checks initial value
		expect(result.current.notificationsToggledOn).toBe(initialNotificationsToggledOn);

		// simulates clicking the toggle action
		await act(async () => {
			await result.current.toggleNotifications();
		});

		// checks if callRcbEvent was called with rcb-toggle-notifications and correct arguments
		expect(callRcbEventMock).toHaveBeenCalledWith(RcbEvent.TOGGLE_NOTIFICATIONS, {
			currState: initialNotificationsToggledOn,
			newState: !initialNotificationsToggledOn,
		});

		// checks if notifications state was updated
		expect(result.current.notificationsToggledOn).toBe(!initialNotificationsToggledOn);

		// simulates clicking the toggle action
		await act(async () => {
			await result.current.toggleNotifications();
		});

		// checks if callRcbEvent was called with rcb-toggle-notifications and correct arguments
		expect(callRcbEventMock).toHaveBeenCalledWith(RcbEvent.TOGGLE_NOTIFICATIONS, {
			currState: !initialNotificationsToggledOn,
			newState: initialNotificationsToggledOn,
		});

		// check if notifications state was updated
		expect(result.current.notificationsToggledOn).toBe(initialNotificationsToggledOn);
	});

	it("should prevent toggling when event is defaultPrevented", async () => {
		// mocks rcb event handler
		const callRcbEventMock = jest.fn().mockReturnValue({ defaultPrevented: true });
		mockUseRcbEventInternal.mockReturnValue({
			callRcbEvent: callRcbEventMock,
		});

		// renders the hook within the TestChatBotProvider
		const { result } = renderHook(() => useNotificationInternal(), {
			wrapper: TestChatBotProvider
		});

		// checks initial value
		expect(result.current.notificationsToggledOn).toBe(initialNotificationsToggledOn);

		// simulates clicking the toggle action
		await act(async () => {
			await result.current.toggleNotifications();
		});

		// checks if callRcbEvent was called with rcb-toggle-notifications and correct arguments
		expect(callRcbEventMock).toHaveBeenCalledWith(RcbEvent.TOGGLE_NOTIFICATIONS, {
			currState: initialNotificationsToggledOn,
			newState: !initialNotificationsToggledOn,
		});

		// checks if notifications state stayed the same
		expect(result.current.notificationsToggledOn).toBe(initialNotificationsToggledOn);
	});
});
