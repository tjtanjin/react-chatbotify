import React from "react";

import { expect } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/jest-globals";

import { useSettingsContext, SettingsProvider } from "../../src/context/SettingsContext";
import { DefaultSettings } from "../../src/constants/internal/DefaultSettings";
import { Settings } from "../../src/types/Settings";

const TestComponent = () => {
	const { settings, setSettings } = useSettingsContext();

	return (
		<div>
			<p data-testid="settings">{JSON.stringify(settings)}</p>
			<button data-testid="updateSettings" onClick={() => setSettings((prevSettings) => ({ ...prevSettings, 
				general: { ...prevSettings.general, primaryColor: '#123456' } }))}>
				Update Settings
			</button>
		</div>
	);
};

describe("SettingsContext", () => {
	it("provides the correct default values", () => {
		render(
			<SettingsProvider settings={DefaultSettings} setSettings={() => null}>
				<TestComponent />
			</SettingsProvider>
		);

		expect(screen.getByTestId("settings")).toHaveTextContent(JSON.stringify(DefaultSettings));
	});

	it("allows updating settings", () => {
		let currentSettings = DefaultSettings;

		const mockSetSettings: React.Dispatch<React.SetStateAction<Settings>> = (newSettings) => {
			// Handle both the direct object case and updater function case
			if (typeof newSettings === "function") {
				currentSettings = (newSettings as (prevState: Settings) => Settings)(currentSettings);
			} else {
				currentSettings = { ...currentSettings, ...newSettings };
			}
		};

		const { rerender } = render(
			<SettingsProvider settings={currentSettings} setSettings={mockSetSettings}>
				<TestComponent />
			</SettingsProvider>
		);

		screen.getByTestId("updateSettings").click();

		rerender(
			<SettingsProvider settings={currentSettings} setSettings={mockSetSettings}>
				<TestComponent />
			</SettingsProvider>
		);

		expect(screen.getByTestId("settings")).toHaveTextContent(JSON.stringify({...DefaultSettings, 
			general: { ...DefaultSettings.general, primaryColor: '#123456' } }));
	});

	it("can initialize with custom settings", () => {
		const customSettings = {
			general: {
				primaryColor: "#000000",
				secondaryColor: "#ffffff",
				fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', " +
                    "'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', " +
                    "sans-serif",
				showHeader: false,
				showFooter: false,
				showInputRow: false,
				embedded: false,
				desktopEnabled: false,
				mobileEnabled: false,
				flowStartTrigger: "ON_LOAD",
			},
		};

		render(
			<SettingsProvider settings={customSettings} setSettings={() => null}>
				<TestComponent />
			</SettingsProvider>
		);

		expect(screen.getByTestId("settings")).toHaveTextContent(JSON.stringify(customSettings));
	});
});
