import { processAudio, speak } from "../../src/services/AudioService";
import { Settings } from "../../src/types/Settings";

// sample voices
const availableVoices = [
	{
		name: "Google US English",
		lang: "en-US",
		voiceURI: "Google US English",
		default: true,
		localService: true,
	},
	{
		name: "Google UK English",
		lang: "en-GB",
		voiceURI: "Google UK English",
		default: false,
		localService: true,
	},
];

// mock speechsynthesis
class MockSpeechSynthesisUtterance {
	text = "";
	lang = "";
	rate = 1;
	volume = 1;
	voice: SpeechSynthesisVoice | undefined = undefined;
}
const mockSpeak = jest.fn();
const mockGetVoices = jest.fn().mockReturnValue(availableVoices);

beforeAll(() => {
	(global as any).SpeechSynthesisUtterance = MockSpeechSynthesisUtterance;
	(global as any).speechSynthesis = {
		speak: mockSpeak,
		getVoices: mockGetVoices,
	};
});

beforeEach(() => {
	jest.clearAllMocks();
	mockGetVoices.mockReturnValue(availableVoices);
});

describe("AudioService", () => {
	it("should log info and not speak if SpeechSynthesisUtterance is not supported", () => {
		const originalUtterance = (global as any).SpeechSynthesisUtterance;
		(global as any).SpeechSynthesisUtterance = undefined;

		const consoleInfoSpy = jest.spyOn(console, "info").mockImplementation(() => {});
		speak("Test message", "en-US", ["Google US English"], 1, 1);
		expect(consoleInfoSpy).toHaveBeenCalledWith(
			"Speech Synthesis API is not supported in this environment."
		);
		expect(mockSpeak).not.toHaveBeenCalled();

		// restore original SpeechSynthesisUtterance
		(global as any).SpeechSynthesisUtterance = originalUtterance;
		consoleInfoSpy.mockRestore();
	});

	it("should call speak with matched voice if found", () => {
		speak("Hello", "en-US", ["Google US English"], 1, 1);
		expect(mockSpeak).toHaveBeenCalledTimes(1);

		const utterance = mockSpeak.mock.calls[0][0] as MockSpeechSynthesisUtterance;
		expect(utterance.text).toBe("Hello");
		expect(utterance.lang).toBe("en-US");
		expect(utterance.rate).toBe(1);
		expect(utterance.volume).toBe(1);
		// since "Google US English" is available, the matched voice should be assigned.
		expect(utterance.voice).toEqual(availableVoices[0]);
	});

	it("should call speak with default voice if no matching voice is found", () => {
		speak("Hello", "en-US", ["Non-Existent Voice"], 1, 1);
		expect(mockSpeak).toHaveBeenCalledTimes(1);

		const utterance = mockSpeak.mock.calls[0][0] as MockSpeechSynthesisUtterance;
		expect(utterance.text).toBe("Hello");
		expect(utterance.lang).toBe("en-US");
		expect(utterance.rate).toBe(1);
		expect(utterance.volume).toBe(1);
		// no matching voice so utterance.voice should remain undefined.
		expect(utterance.voice).toBeUndefined();
	});

	it("should call speak with correct parameters", () => {
		const settings: Settings = {
			audio: {
				disabled: false,
				voiceNames: ["Google US English"],
				language: "en-US",
				rate: 1.2,
				volume: 0.8,
			},
		} as Settings;

		processAudio(settings, "Hello World");

		// processAudio internally calls speak
		expect(mockSpeak).toHaveBeenCalledTimes(1);
		const utterance = mockSpeak.mock.calls[0][0] as MockSpeechSynthesisUtterance;
		expect(utterance.text).toBe("Hello World");
		expect(utterance.lang).toBe("en-US");
		expect(utterance.rate).toBe(1.2);
		expect(utterance.volume).toBe(0.8);
		// since "Google US English" is available, the matched voice should be assigned.
		expect(utterance.voice).toEqual(availableVoices[0]);
	});
});
