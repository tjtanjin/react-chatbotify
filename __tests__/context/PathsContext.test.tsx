import React from 'react'

import { expect } from '@jest/globals'
import { act, render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/jest-globals'

import { usePathsContext, PathsProvider } from '../../src/context/PathsContext'

const TestComponent = () => {
	const { paths, setPaths } = usePathsContext()

	const handleAddPath = () => {
		setPaths([...paths, '/path/to/1'])
	}

	const handleClearPaths = () => {
		setPaths([])
	}

	return (
		<div>
			<p data-testid="pathsCount">Paths Count: {paths.length}</p>

			<button onClick={handleAddPath}>Add Path</button>
			<button onClick={handleClearPaths}>Clear Paths</button>
		</div>
	)
}

describe('PathsContext', () => {
	it('provides the correct default values', () => {
		render(
			<PathsProvider>
				<TestComponent />
			</PathsProvider>
		)

		expect(screen.getByTestId('pathsCount')).toHaveTextContent(`Paths Count: 0`)
	})

	it('allows adding paths in the context', () => {
		render(
			<PathsProvider>
				<TestComponent />
			</PathsProvider>
		)

		const addPathBtn = screen.getByText('Add Path')

		act(() => {
			addPathBtn.click()
		})

		expect(screen.getByTestId('pathsCount')).toHaveTextContent(`Paths Count: 1`)

		act(() => {
			addPathBtn.click()
		})

		expect(screen.getByTestId('pathsCount')).toHaveTextContent(`Paths Count: 2`)
	})

	it('allows updating paths in the context', () => {
		render(
			<PathsProvider>
				<TestComponent />
			</PathsProvider>
		)

		const clearPathsBtn = screen.getByText('Clear Paths')
		const addPathBtn = screen.getByText('Add Path')

		act(() => {
			clearPathsBtn.click()
		})

		expect(screen.getByTestId('pathsCount')).toHaveTextContent(`Paths Count: 0`)

		act(() => {
			addPathBtn.click()
		})

		expect(screen.getByTestId('pathsCount')).toHaveTextContent(`Paths Count: 1`)
	})
})
