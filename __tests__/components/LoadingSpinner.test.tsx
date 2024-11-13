import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";

import LoadingSpinner from "../../src/components/LoadingSpinner/LoadingSpinner";
import { TestChatBotProvider } from "../__mocks__/TestChatBotContext";

/**
 * Helper function to render LoadingSpinner with mocked settings and styles.
 *
 * @param primaryColor Color for the spinner border
 * @param loadingSpinnerStyle Additional styles for the spinner
 */
const renderLoadingSpinner = (primaryColor = "#3498db", loadingSpinnerStyle = {}) => {
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
});
