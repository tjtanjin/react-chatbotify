import React from "react";
import { expect, it, describe, beforeEach, jest } from "@jest/globals";
import { createMessage } from "../../src/utils/messageBuilder";
import { generateSecureUUID } from "../../src/utils/idGenerator";

// mocks id generator
jest.mock("../../src/utils/idGenerator");
const mockedGenerateSecureUUID = generateSecureUUID as jest.MockedFunction<typeof generateSecureUUID>;

/**
 * Test for message builder.
 */
describe("createMessage", () => {
	beforeEach(() => {
		// Reset all mocks before each test
		jest.clearAllMocks();
	});

	it("should create a message with string content correctly", () => {
		// mocks message details
		const mockId = "mocked-uuid";
		mockedGenerateSecureUUID.mockReturnValue(mockId);
		const content = "This is a test message";
		const sender = "bot";

		// creates message
		const message = createMessage(content, sender);

		// checks if message is created correctly
		expect(generateSecureUUID).toHaveBeenCalledTimes(1);
		expect(message).toEqual({
			id: mockId,
			content,
			sender,
			type: "string",
			timestamp: expect.any(String),
		});

		// checks timestamp format
		const timestampDate = new Date(message.timestamp);
		expect(timestampDate.toUTCString()).toBe(message.timestamp);
	});

	it("should create a message with JSX.Element content correctly", () => {
		// mocks message details
		const mockId = "mocked-uuid";
		mockedGenerateSecureUUID.mockReturnValue(mockId);
		const content = React.createElement("div");
		const sender = "user";

		// creates message
		const message = createMessage(content, sender);

		// checks if message is created correctly
		expect(generateSecureUUID).toHaveBeenCalledTimes(1);
		expect(message).toEqual({
			id: mockId,
			content,
			sender,
			type: "object",
			timestamp: expect.any(String), // We"ll validate the format separately
		});

		// checks timestamp format
		const timestampDate = new Date(message.timestamp);
		expect(timestampDate.toUTCString()).toBe(message.timestamp);
	});

	it("should handle empty string content correctly", () => {
		// mocks message details
		const mockId = "mocked-uuid";
		mockedGenerateSecureUUID.mockReturnValue(mockId);
		const content = "";
		const sender = "bot";

		// creates message
		const message = createMessage(content, sender);

		// checks if message is created correctly
		expect(generateSecureUUID).toHaveBeenCalledTimes(1);
		expect(message).toEqual({
			id: mockId,
			content,
			sender,
			type: "string",
			timestamp: expect.any(String),
		});

		// checks timestamp format
		const timestampDate = new Date(message.timestamp);
		expect(timestampDate.toUTCString()).toBe(message.timestamp);
	});

	it("should handle special characters in content correctly", () => {
		// mocks message details
		const mockId = "mocked-uuid";
		mockedGenerateSecureUUID.mockReturnValue(mockId);
		const content = 'Special characters! @#$%^&*()_+-=[]{}|;\':",.<>/?`~';
		const sender = "user";

		// creates message
		const message = createMessage(content, sender);

		// checks if message is created correctly
		expect(generateSecureUUID).toHaveBeenCalledTimes(1);
		expect(message).toEqual({
			id: mockId,
			content,
			sender,
			type: "string",
			timestamp: expect.any(String),
		});

		// checks timestamp format
		const timestampDate = new Date(message.timestamp);
		expect(timestampDate.toUTCString()).toBe(message.timestamp);
	});

	it("should handle content as a complex JSX.Element correctly", () => {
		// mocks message details
		const mockId = "mocked-uuid";
		mockedGenerateSecureUUID.mockReturnValue(mockId);
		const content = React.createElement(
			'div',
			{ className: 'container' },
			React.createElement('h1', null, 'Title'),
			React.createElement(
				'p',
				null,
				'This is a paragraph with ',
				React.createElement('strong', null, 'bold'),
				' text.'
			),
			React.createElement(
				'ul',
				null,
				React.createElement('li', null, 'Item 1'),
				React.createElement('li', null, 'Item 2'),
				React.createElement('li', null, 'Item 3')
			)
		);
		const sender = "bot";

		// creates message
		const message = createMessage(content, sender);

		// checks if message is created correctly
		expect(generateSecureUUID).toHaveBeenCalledTimes(1);
		expect(message).toEqual({
			id: mockId,
			content,
			sender,
			type: "object",
			timestamp: expect.any(String),
		});

		// checks timestamp format
		const timestampDate = new Date(message.timestamp);
		expect(timestampDate.toUTCString()).toBe(message.timestamp);
	});
});
