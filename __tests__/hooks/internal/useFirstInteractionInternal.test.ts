import { renderHook, act } from "@testing-library/react";
import { expect } from "@jest/globals";

import { useFirstInteractionInternal } from "../../../src/hooks/internal/useFirstInteractionInternal";

jest.mock("../../../src/context/BotStatesContext", () => ({
	useBotStatesContext: jest.fn(() => ({
		hasInteractedPage: false,
		setHasInteractedPage: jest.fn(),
		hasFlowStarted: false,
		setHasFlowStarted: jest.fn(),
	})),
}));

jest.mock("../../../src/context/SettingsContext", () => ({
	useSettingsContext: jest.fn(() => ({
		settings: {
			general: {
				flowStartTrigger: "ON_PAGE_INTERACT",
			},
		},
	})),
}));
class MockSpeechSynthesisUtterance {
	text = "";
	onend: () => void = () => {};

	constructor() {
		setTimeout(() => {
			this.onend();
		}, 0);
	}
}
	
const MockSpeechSynthesis = {
	speak: jest.fn().mockImplementation((utterance: MockSpeechSynthesisUtterance) => {
		utterance.onend();
	}),
};

global.SpeechSynthesisUtterance = MockSpeechSynthesisUtterance as any;
global.speechSynthesis = MockSpeechSynthesis as any;

describe("useFirstInteractionInternal", () => {
	let setHasInteractedPage: jest.Mock;
	let setHasFlowStarted: jest.Mock;

	beforeEach(() => {
		setHasInteractedPage = jest.fn();
		setHasFlowStarted = jest.fn();

		(require("../../../src/context/BotStatesContext").useBotStatesContext as jest.Mock).mockReturnValue({
			hasInteractedPage: false,
			setHasInteractedPage,
			hasFlowStarted: false,
			setHasFlowStarted,
		});
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it("should call setHasInteractedPage and setHasFlowStarted on interaction", () => {
		const { result } = renderHook(() => useFirstInteractionInternal());

		act(() => {
			result.current.handleFirstInteraction();
		});

		expect(setHasInteractedPage).toHaveBeenCalledWith(true);
		expect(setHasFlowStarted).toHaveBeenCalledWith(true);
	});
});
