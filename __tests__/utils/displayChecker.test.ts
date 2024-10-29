import { expect, it, describe, beforeEach, jest } from "@jest/globals";
import { isChatBotVisible } from "../../src/utils/displayChecker";

describe("isChatBotVisible", () => {
	beforeAll(() => {
		// Set the viewport size for testing
		Object.defineProperty(window, 'innerHeight', { value: 768 });
		Object.defineProperty(window, 'innerWidth', { value: 1024 });
	});

	beforeEach(() => {
		// Reset all mocks before each test
		jest.clearAllMocks();
	});

	it("should return false when element is null", () => {
		// Call the function with the mocked element as null
		const result = isChatBotVisible(null as unknown as HTMLDivElement);
		expect(result).toBe(false);
	});

	it("should return false when element is undefined", () => {
		// Call the function with the mocked element as undefined
		const result = isChatBotVisible(undefined as unknown as HTMLDivElement);
		expect(result).toBe(false);
	});

	it("should return true when element is fully visible in the viewport", () => {
		// Mock div element
		const element = document.createElement('div');

		// Mock getBoundingClientRect to return values indicating the element is fully visible
		element.getBoundingClientRect = jest.fn(() => ({
			top: 100,        // Element's top edge is below the viewport top
			left: 100,       // Element's left edge is right of the viewport left
			bottom: 200,     // Element's bottom edge is within viewport height
			right: 200,      // Element's right edge is within viewport width
			width: 100,
			height: 100,
			x: 100,         // Left position relative to the viewport
			y: 100,         // Top position relative to the viewport
			toJSON: () => ({
				top: 100,
				left: 100,
				bottom: 200,
				right: 200,
				width: 100,
				height: 100,
			}),             // toJSON method mocked
		}));

		// Call the function with the mocked element
		const result = isChatBotVisible(element);
		expect(result).toBe(true);
	});

	it("should return false when element's top is less than 0", () => {
		// Mock div element
		const element = document.createElement('div');

		// Mock getBoundingClientRect to return "top" value as negative
		element.getBoundingClientRect = jest.fn(() => ({
			top: -1,        // Element's top edge is out of view
			left: 100,       
			bottom: 200,     
			right: 200,      
			width: 100,
			height: 100,
			x: 100,  
			y: 100,  
			toJSON: () => ({
				top: 100,
				left: 100,
				bottom: 200,
				right: 200,
				width: 100,
				height: 100,
			}), 
		}));

		// Call the function with the mocked element
		const result = isChatBotVisible(element);
		expect(result).toBe(false);
	});

	it("should return false when element's left is less than 0", () => {
		// Mock div element
		const element = document.createElement('div');

		// Mock getBoundingClientRect to return "left" value as negative
		element.getBoundingClientRect = jest.fn(() => ({
			top: 100,        
			left: -1,       // Element's left edge is out of view
			bottom: 200,    
			right: 200,      
			width: 100,
			height: 100,
			x: 100,  
			y: 100,  
			toJSON: () => ({
				top: 100,
				left: 100,
				bottom: 200,
				right: 200,
				width: 100,
				height: 100,
			}), 
		}));
		// Call the function with the mocked element
		const result = isChatBotVisible(element);
		expect(result).toBe(false);
	});
    
	it("should return false when element's bottom exceeds window height", () => {
		// Mock div element
		const element = document.createElement('div');

		// Mock getBoundingClientRect to return "bottom" value larger than the value of vh
		element.getBoundingClientRect = jest.fn(() => ({
			top: 100,        
			left: 100,      
			bottom: 800,     // Element's bottom edge exceeds viewport height
			right: 200,      
			width: 100,
			height: 100,
			x: 100,  
			y: 100,  
			toJSON: () => ({
				top: 100,
				left: 100,
				bottom: 200,
				right: 200,
				width: 100,
				height: 100,
			}), 
		}));

		// Call the function with the mocked element
		const result = isChatBotVisible(element);
		expect(result).toBe(false);
	});

	it("should return false when element's right exceeds window width", () => {
		// Mock div element
		const element = document.createElement('div');

		// Mock getBoundingClientRect to return "right" value larger than the value of vw
		element.getBoundingClientRect = jest.fn(() => ({
			top: 100,        
			left: 100,       
			bottom: 200,     
			right: 1100,      // Element's right edge exceeds viewport width
			width: 100,
			height: 100,
			x: 100,  
			y: 100,  
			toJSON: () => ({
				top: 100,
				left: 100,
				bottom: 200,
				right: 200,
				width: 100,
				height: 100,
			}), 
		}));

		// Call the function with the mocked element
		const result = isChatBotVisible(element);
		expect(result).toBe(false);
	});
});