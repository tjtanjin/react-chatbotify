import React from "react";
import { expect } from "@jest/globals";
import { render, screen} from "@testing-library/react";
import { act } from "react";
import "@testing-library/jest-dom/jest-globals";

import { useToastsContext, ToastsProvider } from "../../src/context/ToastsContext";

const TestComponent = () => {
	const { toasts, setToasts } = useToastsContext();

	const addToast = () => {
		const newId = toasts.length > 0 ? String(Number(toasts[toasts.length - 1].id) + 1) : '1';
		setToasts([...toasts, { id: newId, content: "New Toast" }]);
	};

	return (
		<div>
			<p data-testid="toastsCount">Toasts count: {toasts.length}</p>
			<button onClick={addToast}>
				Add Toast
			</button>
		</div>
	);
};

describe("ToastsContext", () => {
	it("provides the correct default values", () => {
		render(
			<ToastsProvider>
				<TestComponent />
			</ToastsProvider>
		);

		expect(screen.getByTestId("toastsCount")).toHaveTextContent("Toasts count: 0");
	});

	it("allows adding toasts and updates the context", () => {
		render(
			<ToastsProvider>
				<TestComponent />
			</ToastsProvider>
		);

		const addToastButton = screen.getByText("Add Toast");

		act(() => {
			addToastButton.click();
		});
		expect(screen.getByTestId("toastsCount")).toHaveTextContent("Toasts count: 1");

		act(() => {
			addToastButton.click();
		});
		expect(screen.getByTestId("toastsCount")).toHaveTextContent("Toasts count: 2");

		act(() => {
			addToastButton.click();
		});
		expect(screen.getByTestId("toastsCount")).toHaveTextContent("Toasts count: 3");
	});

	it("allows updating toasts through setToasts", () => {
		const TestComponentWithUpdate = () => {
			const { toasts, setToasts } = useToastsContext();

			return (
				<div>
					<p data-testid="toastsCount">Toasts count: {toasts.length}</p>
					<button onClick={() => setToasts([])}>Clear Toasts</button>
					<button onClick={() => setToasts([{ id: '1', content: "Test Toast" }])}>Set One Toast</button>
				</div>
			);
		};

		render(
			<ToastsProvider>
				<TestComponentWithUpdate />
			</ToastsProvider>
		);

		const setOneToastButton = screen.getByText("Set One Toast");
		const clearToastsButton = screen.getByText("Clear Toasts");

		act(() => {
			setOneToastButton.click();
		});

		expect(screen.getByTestId("toastsCount")).toHaveTextContent("Toasts count: 1");

		act(() => {
			clearToastsButton.click();
		});

		expect(screen.getByTestId("toastsCount")).toHaveTextContent("Toasts count: 0");
	});
});