import React from "react";

import { processAudio } from "../../src/services/AudioService";
import { generateSecureUUID } from "../../src/utils/idGenerator";
import { Settings } from "../../src/types/Settings";
import { Message } from "../../src/types/Message";

// mocks SpeechSynthesisUtterance
class MockSpeechSynthesisUtterance {
	text: string = "";
	lang: string = "";
	rate: number = 1;
	volume: number = 1;
	voice: SpeechSynthesisVoice | null = null;
}
  
// sample voices
const availableVoices: SpeechSynthesisVoice[] = [
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

// mocks speechSynthesis methods
const mockSpeak = jest.fn();
const mockGetVoices = jest.fn().mockReturnValue(availableVoices);

/**
 * Test for AudioService.
 */
describe("AudioService.processAudio (Inline Mocks)", () => {
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
  
	it("does not call speak when audio is disabled", () => {
		// settings for audio
		const settings: Settings = {
			audio: {
				disabled: true,
				voiceNames: ["Google US English"]
			}
		};

		// calls process audio
		const message: Message = {
			id: generateSecureUUID(),
			sender: "user",
			content: "Hello, how can I assist you today?",
			type: "string",
			timestamp: Date.now().toString(),
		};
		const voiceToggledOn = true;
		const isChatWindowOpen = true;
		processAudio(settings, voiceToggledOn, isChatWindowOpen, message);

		// checks that speak is not called
		expect(mockSpeak).not.toHaveBeenCalled();
	});

	it("does not call speak when message is from the user", () => {
		// settings for audio
		const settings: Settings = {
			audio: {
				disabled: false,
				voiceNames: ["Google US English"]
			}
		};

		// defines message to be from user
		const message: Message = {
			id: generateSecureUUID(),
			sender: "user",
			content: "I need help with my account.",
			type: "string",
			timestamp: Date.now().toString(),
		};

		// calls process audio
		const voiceToggledOn = true;
		const isChatWindowOpen = true;
		processAudio(settings, voiceToggledOn, isChatWindowOpen, message);

		// checks that speak is not called
		expect(mockSpeak).not.toHaveBeenCalled();
	});

	it("does not call speak when message content is not a string", () => {
		// settings for audio
		const settings: Settings = {
			audio: {
				disabled: false,
				voiceNames: ["Google US English"]
			}
		};

		// defines message content as an object
		const message: Message = {
			id: generateSecureUUID(),
			sender: "bot",
			content: React.createElement("div"),
			type: "object",
			timestamp: Date.now().toString(),
		};

		// calls process audio
		const voiceToggledOn = true;
		const isChatWindowOpen = true;
		processAudio(settings, voiceToggledOn, isChatWindowOpen, message);

		// checks that speak is not called
		expect(mockSpeak).not.toHaveBeenCalled();
	});

	it("does not call speak when chat window is closed and not embedded", () => {
		// settings for audio and general
		const settings: Settings = {
			audio: {
				disabled: false,
				voiceNames: ["Google US English"]
			}, 
			general: {
				embedded: false
			}
		};

		// calls process audio
		const message: Message = {
			id: generateSecureUUID(),
			sender: "bot",
			content: "Welcome back! How can I help you today?",
			type: "string",
			timestamp: Date.now().toString(),
		};
		const voiceToggledOn = true;
		const isChatWindowOpen = false;
		processAudio(settings, voiceToggledOn, isChatWindowOpen, message);

		// checks that speak is not called
		expect(mockSpeak).not.toHaveBeenCalled();
	});

	it("does not call speak when voice is toggled off", () => {
		// settings for audio
		const settings: Settings = {
			audio: {
				disabled: false,
				voiceNames: ["Google US English"]
			}
		};

		// calls process audio, but voice is toggled off
		const message: Message = {
			id: generateSecureUUID(),
			sender: "bot",
			content: "Let me know if you need any assistance.",
			type: "string",
			timestamp: Date.now().toString(),
		};
		const voiceToggledOn = false;
		const isChatWindowOpen = true;
		processAudio(settings, voiceToggledOn, isChatWindowOpen, message);

		// checks that speak is not called
		expect(mockSpeak).not.toHaveBeenCalled();
	});

	it("calls speak with the specified voice when all conditions are met and voice is found", () => {
		// settings for audio
		const settings: Settings = {
			audio: {
				disabled: false,
				voiceNames: ["Google US English"]
			}
		};

		// calls process audio
		const message: Message = {
			id: generateSecureUUID(),
			sender: "bot",
			content: "Hello! How can I assist you today?",
			type: "string",
			timestamp: Date.now().toString(),
		};
		const voiceToggledOn = true;
		const isChatWindowOpen = true;
		processAudio(settings, voiceToggledOn, isChatWindowOpen, message);

		// checks that speak is called correctly
		expect(mockSpeak).toHaveBeenCalledTimes(1);
		expect(mockSpeak).toHaveBeenCalledWith(expect.any(SpeechSynthesisUtterance));
		const utterance = mockSpeak.mock.calls[0][0] as SpeechSynthesisUtterance;
		expect(utterance.text).toBe(message.content);
		expect(utterance.lang).toBe(settings.audio?.language);
		expect(utterance.rate).toBe(settings.audio?.rate);
		expect(utterance.volume).toBe(settings.audio?.volume);
		expect(utterance.voice?.name).toEqual(availableVoices[0].name);
	});

	it("calls speak without a specified voice when all conditions are met but voice is not found", () => {
		// settings for audio
		const settings: Settings = {
			audio: {
				disabled: false,
				voiceNames: ["Non-Existent Voice"],
			}
		};

		// calls process audio
		const message: Message = {
			id: generateSecureUUID(),
			sender: "bot",
			content: "This is a test message without a specified voice.",
			type: "string",
			timestamp: Date.now().toString(),
		};
		const voiceToggledOn = true;
		const isChatWindowOpen = true;
		processAudio(settings, voiceToggledOn, isChatWindowOpen, message);

		// checks that speak is called correctly
		expect(mockSpeak).toHaveBeenCalledTimes(1);
		expect(mockSpeak).toHaveBeenCalledWith(expect.any(SpeechSynthesisUtterance));
		const utterance = mockSpeak.mock.calls[0][0] as SpeechSynthesisUtterance;
		expect(utterance.text).toBe(message.content);
		expect(utterance.lang).toBe(settings.audio?.language);
		expect(utterance.rate).toBe(settings.audio?.rate);
		expect(utterance.volume).toBe(settings.audio?.volume);
		expect(utterance.voice).toBeNull();
	});
});