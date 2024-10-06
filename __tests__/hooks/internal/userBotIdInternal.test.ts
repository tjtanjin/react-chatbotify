import { renderHook } from "@testing-library/react";
import { expect } from "@jest/globals";

import { useBotIdInternal } from "../../../src/hooks/internal/useBotIdInternal";
import { useBotRefsContext } from "../../../src/context/BotRefsContext";

// Mock the useBotRefsContext
jest.mock("../../../src/context/BotRefsContext");

// Cast the mock to allow TypeScript to recognize jest mock methods
const mockedUseBotRefsContext = useBotRefsContext as jest.Mock;

describe("useBotIdInternal", () => {
	it("should return the correct botId", () => {
		// Mock botIdRef
		const botIdRef = { current: "test-bot-id" };
		
		// Mock implementation of useBotRefsContext
		mockedUseBotRefsContext.mockReturnValue({ botIdRef });

		// Render the hook
		const { result } = renderHook(() => useBotIdInternal());

		// Call the getBotId method and assert the returned value
		expect(result.current.getBotId()).toBe("test-bot-id");
	});
});