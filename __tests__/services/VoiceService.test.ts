import { jest, SpyInstance } from "@jest/globals";
import * as VoiceService from "../../src/services/VoiceService";

describe("VoiceService", () => {
    let mockRecognition: jest.Mocked<SpeechRecognition>;
    let mockMediaRecorder: jest.Mocked<MediaRecorder>;
    let mockStopVoiceRecording: jest.SpyInstance<any, any>;

    beforeAll(() => {
        // Mock navigator.mediaDevices if undefined
        if (!navigator.mediaDevices) {
            Object.defineProperty(navigator, "mediaDevices", {
                value: {
                    getUserMedia: jest.fn(),
                },
                writable: true,
            });
        }
    });

    beforeEach(() => {
        // Mock SpeechRecognition
        mockRecognition = {
            start: jest.fn(),
            stop: jest.fn(),
            onresult: null,
            onend: null,
        } as unknown as jest.Mocked<SpeechRecognition>;

        window.SpeechRecognition = jest.fn(() => mockRecognition) as any;

        // Mock MediaRecorder
        mockMediaRecorder = {
            start: jest.fn(),
            stop: jest.fn(),
            ondataavailable: null,
            onstop: null,
            state: "inactive",
        } as unknown as jest.Mocked<MediaRecorder>;

        global.MediaRecorder = jest.fn(() => mockMediaRecorder) as any;

        // Mock getUserMedia
        jest.spyOn(navigator.mediaDevices, "getUserMedia").mockResolvedValue({
            active: true,
            id: "mockStreamId",
            onaddtrack: null,
            onremovetrack: null,
            getTracks: jest.fn(() => [{ kind: "audio", stop: jest.fn() }]),
            addTrack: jest.fn(),
            removeTrack: jest.fn(),
            getAudioTracks: jest.fn(() => []),
            getVideoTracks: jest.fn(() => []),
            clone: jest.fn(),
            addEventListener: jest.fn(),
            removeEventListener: jest.fn(),
            dispatchEvent: jest.fn(),
        } as unknown as MediaStream);

        mockStopVoiceRecording = jest.spyOn(VoiceService, "stopVoiceRecording");
    });

    afterEach(() => {
        jest.restoreAllMocks(); // Clean up mocks after each test
    });

    describe("startVoiceRecording", () => {
        it("should start SpeechRecognition when sendAsAudio is false", () => {
            const settings = { voice: { sendAsAudio: false, language: "en-US" } } as any;
            const mockToggleVoice = jest.fn(() => Promise.resolve());

            VoiceService.startVoiceRecording(
                settings,
                mockToggleVoice,
                jest.fn(),
                jest.fn(),
                jest.fn(),
                { current: [] },
                { current: null }
            );

            expect(mockRecognition.start).toHaveBeenCalled();
        });

        it("should start MediaRecorder when sendAsAudio is true", async () => {
            const settings = { voice: { sendAsAudio: true } } as any;
            const mockToggleVoice = jest.fn(() => Promise.resolve());

            await VoiceService.startVoiceRecording(
                settings,
                mockToggleVoice,
                jest.fn(),
                jest.fn(),
                jest.fn(),
                { current: [] },
                { current: null }
            );

            expect(navigator.mediaDevices.getUserMedia).toHaveBeenCalledWith({ audio: true });
            expect(mockMediaRecorder.start).toHaveBeenCalled();
        });
    });

    describe("stopVoiceRecording", () => {
        it("should stop SpeechRecognition and MediaRecorder", () => {
            VoiceService.stopVoiceRecording();

            expect(mockRecognition.stop).toHaveBeenCalled();
            expect(mockMediaRecorder.stop).toHaveBeenCalled();
        });
    });

    describe("syncVoiceWithChatInput", () => {
        it("should start MediaRecorder if keepVoiceOn is true and sendAsAudio is enabled", () => {
            const settings = { voice: { sendAsAudio: true, disabled: false } } as any;

            VoiceService.syncVoiceWithChatInput(true, settings);

            expect(mockMediaRecorder.start).toHaveBeenCalled();
        });

        it("should start SpeechRecognition if keepVoiceOn is true and sendAsAudio is disabled", () => {
            const settings = { voice: { sendAsAudio: false, disabled: false } } as any;

            VoiceService.syncVoiceWithChatInput(true, settings);

            expect(mockRecognition.start).toHaveBeenCalled();
        });

        it("should stop all voice recording if keepVoiceOn is false", () => {
            const settings = { voice: { sendAsAudio: false, disabled: false } } as any;

            VoiceService.syncVoiceWithChatInput(false, settings);

            expect(mockStopVoiceRecording).toHaveBeenCalled();
        });
    });
});
