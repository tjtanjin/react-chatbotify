import React from 'react';
import { expect } from "@jest/globals";
import { render, screen, fireEvent } from '@testing-library/react';
import "@testing-library/jest-dom/jest-globals";
import ChatBotButton from '../../../src/components/ChatBotButton/ChatBotButton'; 
import { TestChatBotProvider } from '../../__mocks__/TestChatBotContext';
import { DefaultSettings } from "../../../src/constants/internal/DefaultSettings";

// Helper function to render ChatBotButton within TestChatBotProvider
const renderChatBotButton = () => {
	return render(
		<TestChatBotProvider initialSettings={DefaultSettings}>
			<ChatBotButton />  
		</TestChatBotProvider>
	);
};

describe('ChatBotButton', () => {
	it('renders ChatBotButton correctly', () => {
		renderChatBotButton();
		const button = screen.getByRole('button');
		expect(button).toBeInTheDocument();
	});

	// Mock visibility toggle function (assuming it's triggered by a button click)
	it('toggles visibility classes correctly based on internal function', () => {
		renderChatBotButton();
		const button = screen.getByRole('button');

		// Initially visible
		expect(button).toHaveClass('rcb-button-show');

		// Simulate state change or function that hides the button
		fireEvent.click(button); // Assuming the button click triggers visibility toggle
		expect(button).toHaveClass('rcb-button-hide');  // Check if the class changes to hidden
	});
});
