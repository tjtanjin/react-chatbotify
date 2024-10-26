import React from 'react'

import { expect } from '@jest/globals'
import { act, render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/jest-globals'

import {
	useMessagesContext,
	MessagesProvider,
} from '../../src/context/MessagesContext'

const TestComponent = () => {
	const { messages, setMessages } = useMessagesContext()

	const handleAddMessage = () => {
		setMessages([
			...messages,
			{
				id: '1',
				content: 'Hello World!',
				sender: 'user1',
				type: 'message',
				timestamp: new Date().toUTCString(),
			},
		])
	}

	const handleClearMessage = () => {
		setMessages([])
	}

	return (
		<div>
			<p data-testid="messages">
				Messages: {messages.map((message) => message.content).join(', ')}
			</p>
			<p data-testid="messagesCount">Messages Count: {messages.length}</p>

			<button onClick={handleAddMessage}>Add Message</button>
			<button onClick={handleClearMessage}>Clear Message</button>
		</div>
	)
}

describe('MessagesContext', () => {
	it('provides the correct default values', () => {
		render(
			<MessagesProvider>
				<TestComponent />
			</MessagesProvider>
		)

		expect(screen.getByTestId('messages')).toHaveTextContent(`Messages:`)
		expect(screen.getByTestId('messagesCount')).toHaveTextContent(
			`Messages Count: 0`
		)
	})

	it('allows adding messages in the context', () => {
		render(
			<MessagesProvider>
				<TestComponent />
			</MessagesProvider>
		)

		const addMessageBtn = screen.getByText('Add Message')

		act(() => {
			addMessageBtn.click()
		})

		expect(screen.getByTestId('messages')).toHaveTextContent(
			`Messages: Hello World!`
		)
		expect(screen.getByTestId('messagesCount')).toHaveTextContent(
			`Messages Count: 1`
		)

		act(() => {
			addMessageBtn.click()
		})

		expect(screen.getByTestId('messagesCount')).toHaveTextContent(
			`Messages Count: 2`
		)
	})

	it('allows updating messages in the context', () => {
		render(
			<MessagesProvider>
				<TestComponent />
			</MessagesProvider>
		)

		const clearMessageBtn = screen.getByText('Clear Message')
		const addMessageBtn = screen.getByText('Add Message')

		act(() => {
			clearMessageBtn.click()
		})

		expect(screen.getByTestId('messages')).toHaveTextContent(`Messages:`)
		expect(screen.getByTestId('messagesCount')).toHaveTextContent(
			`Messages Count: 0`
		)

		act(() => {
			addMessageBtn.click()
		})

		expect(screen.getByTestId('messagesCount')).toHaveTextContent(
			`Messages Count: 1`
		)
	})
})
