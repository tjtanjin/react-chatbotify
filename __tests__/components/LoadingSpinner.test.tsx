import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";

import LoadingSpinner from "../../src/components/LoadingSpinner/LoadingSpinner";
import { DefaultSettings } from "../../src/constants/internal/DefaultSettings";
import { TestChatBotProvider } from "../__mocks__/TestChatBotContext";

/**
 * Helper function to render LoadingSpinner with mocked settings and styles.
 *
 * @param primaryColor Color for the spinner border
 * @param loadingSpinnerStyle Additional styles for the spinner
 */
const renderLoadingSpinner = (primaryColor = DefaultSettings.general?.primaryColor, loadingSpinnerStyle = {}) => {
	const initialSettings = {
		general: {
			primaryColor
		}
	};

	const initialStyles = {
		loadingSpinnerStyle
	};

	return render(
		<TestChatBotProvider initialSettings={initialSettings} initialStyles={initialStyles}>
			<LoadingSpinner />
		</TestChatBotProvider>
	);
};

describe("LoadingSpinner Component", () => {
	it("renders spinner container and spinner elements", () => {
		renderLoadingSpinner();
		const spinnerContainer = document.querySelector(".rcb-spinner-container");
		const spinner = document.querySelector(".rcb-spinner");

		expect(spinnerContainer).toBeInTheDocument();
		expect(spinner).toBeInTheDocument();
	});

	it("applies correct primary color to spinner border", () => {
		renderLoadingSpinner(DefaultSettings.general?.primaryColor);
		const spinner = document.querySelector(".rcb-spinner");
		expect(spinner).toHaveStyle(`border-top: 4px solid ${DefaultSettings.general?.primaryColor}`);
	});

	it("applies additional styles from styles context", () => {
		renderLoadingSpinner(DefaultSettings.general?.primaryColor, 
			{ borderRadius: "50%", width: "40px", height: "40px" });
		const spinner = document.querySelector(".rcb-spinner");
		expect(spinner).toHaveStyle("border-radius: 50%");
		expect(spinner).toHaveStyle("width: 40px");
		expect(spinner).toHaveStyle("height: 40px");
	});
});
