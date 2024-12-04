import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import VoiceButton from "../../../src/components/Buttons/VoiceButton/VoiceButton";
import { TestChatBotProvider } from "../../__mocks__/TestChatBotContext";

/**
 * Helper function to render VoiceButton with different settings.
 *
 * @param disabled boolean indicating if voice is disabled
 * @param defaultToggledOn boolean indicating if voice is toggled on by default
 */
const renderVoiceButton = (disabled = false, defaultToggledOn = false) => {
	const initialSettings = {
		voice: {
			disabled,
			defaultToggledOn,
		},
	};
	return render(
		<TestChatBotProvider initialSettings={initialSettings}>
			<VoiceButton />
		</TestChatBotProvider>
	);
};

/**
 * Tests for VoiceButton component.
 */
describe("VoiceButton Component", () => {
	// Test to check if VoiceButton renders correctly
	it("renders VoiceButton with correct aria-label and initial state", () => {
		renderVoiceButton();

		// Retrieves the button and checks its aria-label
		const button = screen.getByRole("button", { name: /toggle voice/i });
		expect(button).toBeInTheDocument();
		expect(button).toHaveAttribute("aria-label", "toggle voice");
	});

	// Test to confirm the button's initial style
	it("applies correct initial style based on default state", () => {
		renderVoiceButton();

		// Button should have the disabled style initially
		const button = screen.getByRole("button", { name: /toggle voice/i });
		expect(button).toHaveClass("rcb-voice-button-disabled");
	});
});
