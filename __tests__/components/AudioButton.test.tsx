import React from "react";

import { expect } from "@jest/globals";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/jest-globals";

import AudioButton from "../../src/components/Buttons/AudioButton/AudioButton";
import { DefaultSettings } from "../../src/constants/internal/DefaultSettings";

import { TestChatBotProvider } from "../__mocks__/TestChatBotContext";

/**
 * Helper function to render AudioButton with different settings.
 *
 * @param initialSettings initial settings for the TestChatBotProvider
 */
const renderAudioButton = (initialSettings = { audio: { disabled: false, defaultToggledOn: false } }) => {
	return render(
		<TestChatBotProvider initialSettings={initialSettings}>
			<AudioButton />
		</TestChatBotProvider>
	);
};

/**
 * Test for AudioButton component.
 */
describe("AudioButton Component", () => {
	it("renders with correct aria-label and initial state when defaultToggledOn is false and not disabled", () => {
		// settings used for this test to render audio button
		const initialSettings = { audio: { disabled: false, defaultToggledOn: false } };
		renderAudioButton(initialSettings);
	
		// retrieves button and icon
		const button = screen.getByRole("button", { name: DefaultSettings.ariaLabel?.audioButton });
		const icon = button.querySelector("span");
		expect(button).toBeInTheDocument();
	
		// checks new state
		expect(icon).toHaveClass("rcb-audio-icon-off");
	});
	
	it("toggles audio state when clicked (initially off)", () => {
		// settings used for this test to render audio button
		const initialSettings = { audio: { disabled: false, defaultToggledOn: false } };
		renderAudioButton(initialSettings);
	
		// retrieves button and icon
		const button = screen.getByRole("button", { name: DefaultSettings.ariaLabel?.audioButton });
		const icon = button.querySelector("span");
		expect(button).toBeInTheDocument();
	
		// checks initial state
		expect(icon).toHaveClass("rcb-audio-icon-off");
	
		// clicks the button to toggle audio
		fireEvent.mouseDown(button);
	
		// checks new state
		expect(icon).toHaveClass("rcb-audio-icon-on");
	});
	
	it("renders with audio toggled on initially and toggles to off when clicked", () => {
		// settings used for this test to render audio button
		const initialSettings = { audio: { disabled: false, defaultToggledOn: true } };
		renderAudioButton(initialSettings);
	
		// retrieves button and icon
		const button = screen.getByRole("button", { name: DefaultSettings.ariaLabel?.audioButton });
		const icon = button.querySelector("span");
		expect(button).toBeInTheDocument();
	
		// checks initial state
		expect(icon).toHaveClass("rcb-audio-icon-on");
	
		// clicks the button to toggle audio
		fireEvent.mouseDown(button);
	
		// checks new state
		expect(icon).toHaveClass("rcb-audio-icon-off");
	});
	
	it("toggles audio back to on after being toggled off", () => {
		// settings used for this test to render audio button
		const initialSettings = { audio: { disabled: false, defaultToggledOn: true } };
		renderAudioButton(initialSettings);
	
		// retrieves button and icon
		const button = screen.getByRole("button", { name: DefaultSettings.ariaLabel?.audioButton });
		const icon = button.querySelector("span");
		expect(button).toBeInTheDocument();
	
		// checks initial state
		expect(icon).toHaveClass("rcb-audio-icon-on");
	
		// clicks the button to toggle audio
		fireEvent.mouseDown(button);

		// checks new state
		expect(icon).toHaveClass("rcb-audio-icon-off");
	
		// checks new state
		fireEvent.mouseDown(button);
		expect(icon).toHaveClass("rcb-audio-icon-on");
	});
});