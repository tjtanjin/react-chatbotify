import React from 'react';

import { render, screen, act } from '@testing-library/react';
import { StylesProvider, useStylesContext } from '../../src/context/StylesContext';
import { DefaultStyles } from "../../src/constants/internal/DefaultStyles";
import '@testing-library/jest-dom';


// Mocking a child component to test context
const MockChild = () => {
	const { styles, setStyles } = useStylesContext();
    
	return (
		<div>
			<p>Current Styles: {JSON.stringify(styles)}</p>
			<button onClick={() => setStyles({ ...styles, chatWindowStyle: { backgroundColor: 'blue' } })}>
				Change Chat Window Style
			</button>
		</div>
	);
};

// Test suite for StylesProvider
describe('StylesProvider', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	test('provides default styles', () => {
		render(
			<StylesProvider styles={DefaultStyles} setStyles={jest.fn()}>
				<MockChild />
			</StylesProvider>
		);

		// Check if the default styles are provided
		const stylesElement = screen.getByText(`Current Styles: ${JSON.stringify(DefaultStyles)}`);
		expect(stylesElement).toBeInTheDocument();
	});

	test('allows updating styles through setStyles', () => {
		const setStylesMock = jest.fn();
		render(
			<StylesProvider styles={DefaultStyles} setStyles={setStylesMock}>
				<MockChild />
			</StylesProvider>
		);

		// Click the button to change styles
		const button = screen.getByText('Change Chat Window Style');
		act(() => {
			button.click();
		});

		// Verify that setStyles was called with the updated styles
		expect(setStylesMock).toHaveBeenCalledWith({
			...DefaultStyles,
			chatWindowStyle: { backgroundColor: 'blue' },
		});
	});
});
