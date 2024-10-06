import React from "react";

import { expect } from "@jest/globals";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/jest-globals";

import NotificationButton from "../../src/components/Buttons/NotificationButton/NotificationButton";
import { DefaultSettings } from "../../src/constants/internal/DefaultSettings";

import { TestChatBotProvider } from "../__mocks__/TestChatBotContext";

/**
 * Helper function to render NotificationButton with different settings.
 *
 * @param initialSettings initial settings for the TestChatBotProvider
 */
const renderNotificationButton = (initialSettings = { notification: { disabled: false, defaultToggledOn: false } }) => {
	return render(
		<TestChatBotProvider initialSettings={initialSettings}>
			<NotificationButton />
		</TestChatBotProvider>
	);
};

/**
 * Test for NotificationButton component.
 */
describe("NotificationButton Component", () => {
	it("renders with correct aria-label and initial state when defaultToggledOn is false and not disabled", () => {
		// settings used for this test to render notification button
		const initialSettings = { notification: { disabled: false, defaultToggledOn: false } };
		renderNotificationButton(initialSettings);

		// retrieves button and icon
		const button = screen.getByRole("button", { name: DefaultSettings.ariaLabel?.notificationButton });
		const icon = button.querySelector("span");
		expect(button).toBeInTheDocument();

		// checks new state
		expect(icon).toHaveClass("rcb-notification-icon-off");
	});

	it("toggles notification state when clicked (initially off)", () => {
		// settings used for this test to render notification button
		const initialSettings = { notification: { disabled: false, defaultToggledOn: false } };
		renderNotificationButton(initialSettings);

		// retrieves button and icon
		const button = screen.getByRole("button", { name: DefaultSettings.ariaLabel?.notificationButton });
		const icon = button.querySelector("span");
		expect(button).toBeInTheDocument();

		// checks initial state
		expect(icon).toHaveClass("rcb-notification-icon-off");

		// clicks the button to toggle notification
		fireEvent.mouseDown(button);

		// checks new state
		expect(icon).toHaveClass("rcb-notification-icon-on");
	});

	it("renders with notification toggled on initially and toggles to off when clicked", () => {
		// settings used for this test to render notification button
		const initialSettings = { notification: { disabled: false, defaultToggledOn: true } };
		renderNotificationButton(initialSettings);

		// retrieves button and icon
		const button = screen.getByRole("button", { name: DefaultSettings.ariaLabel?.notificationButton });
		const icon = button.querySelector("span");
		expect(button).toBeInTheDocument();

		// checks initial state
		expect(icon).toHaveClass("rcb-notification-icon-on");

		// clicks the button to toggle notification
		fireEvent.mouseDown(button);

		// checks new state
		expect(icon).toHaveClass("rcb-notification-icon-off");
	});

	it("toggles notification back to on after being toggled off", () => {
		// settings used for this test to render notification button
		const initialSettings = { notification: { disabled: false, defaultToggledOn: true } };
		renderNotificationButton(initialSettings);

		// retrieves button and icon
		const button = screen.getByRole("button", { name: DefaultSettings.ariaLabel?.notificationButton });
		const icon = button.querySelector("span");
		expect(button).toBeInTheDocument();

		// checks initial state
		expect(icon).toHaveClass("rcb-notification-icon-on");

		// clicks the button to toggle notification
		fireEvent.mouseDown(button);

		// checks new state
		expect(icon).toHaveClass("rcb-notification-icon-off");

		// checks new state
		fireEvent.mouseDown(button);
		expect(icon).toHaveClass("rcb-notification-icon-on");
	});
});