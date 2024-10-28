import React from 'react';

import { render, screen, fireEvent } from '@testing-library/react';
import { BotStatesProvider, useBotStatesContext } from '../../src/context/BotStatesContext';
import '@testing-library/jest-dom';


const TestComponent = () => {
	const {
		isBotTyping,
		setIsBotTyping,
		isChatWindowOpen,
		setIsChatWindowOpen,
	} = useBotStatesContext();

	return (
		<div>
			<p>Bot Typing: {isBotTyping ? 'Yes' : 'No'}</p>
			<button onClick={() => setIsBotTyping(!isBotTyping)}>
				Toggle Bot Typing
			</button>
			<p>Chat Window Open: {isChatWindowOpen ? 'Yes' : 'No'}</p>
			<button onClick={() => setIsChatWindowOpen(!isChatWindowOpen)}>
				Toggle Chat Window
			</button>
		</div>
	);
};

describe('BotStatesProvider', () => {
	const renderWithProvider = (children: React.ReactNode, settings = {}) => {
		return render(
			<BotStatesProvider settings={settings}>
				{children}
			</BotStatesProvider>
		);
	};

	it('should initialize with default values', () => {
		renderWithProvider(<TestComponent />);

		expect(screen.getByText(/Bot Typing: No/i)).toBeInTheDocument();
		expect(screen.getByText(/Chat Window Open: No/i)).toBeInTheDocument();
	});

	it('should toggle bot typing state', () => {
		renderWithProvider(<TestComponent />);

		const toggleButton = screen.getByRole('button', { name: /Toggle Bot Typing/i });
		fireEvent.click(toggleButton);

		expect(screen.getByText(/Bot Typing: Yes/i)).toBeInTheDocument();
	});

	it('should toggle chat window state', () => {
		renderWithProvider(<TestComponent />);

		const toggleButton = screen.getByRole('button', { name: /Toggle Chat Window/i });
		fireEvent.click(toggleButton);

		expect(screen.getByText(/Chat Window Open: Yes/i)).toBeInTheDocument();
	});

	it('should respect initial settings', () => {
		const settings = {
			chatWindow: { defaultOpen: true },
			audio: { defaultToggledOn: true },
		};

		renderWithProvider(<TestComponent />, settings);

		expect(screen.getByText(/Chat Window Open: Yes/i)).toBeInTheDocument();
	});
});
