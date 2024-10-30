import { getButtonConfig, createAudioButton, createNotificationButton, createCloseChatButton, createVoiceButton,
	createSendButton, createFileAttachmentButton, createEmojiButton} from "../../src/utils/buttonBuilder";
import { Button} from "../../src";

jest.mock("../../src/viteconfig", () => ({
	viteConfig: {
		DEFAULT_URL: "http://localhost:mock",
		DEFAULT_EXPIRATION: "60",
		CACHE_KEY_PREFIX: "VITE_THEME_CACHE_KEY_PREFIX",
	},
}));

const mockLocalStorage = (() => {
	let store: { [key: string]: string } = {};
	return {
		getItem: (key: string) => store[key] || null,
		setItem: (key: string, value: string) => {
			store[key] = value.toString();
		},
		clear: () => {
			store = {};
		},
	};
})();

if (typeof window !== 'undefined') {
    Object.defineProperty(window, 'localStorage', {
        value: mockLocalStorage,
    });
}

describe('getButtonConfig', () => {
	const buttonComponentMap = {
		[Button.AUDIO_BUTTON]: createAudioButton,
		[Button.NOTIFICATION_BUTTON]: createNotificationButton,
		[Button.CLOSE_CHAT_BUTTON]: createCloseChatButton,
		[Button.VOICE_MESSAGE_BUTTON]: createVoiceButton,
		[Button.SEND_MESSAGE_BUTTON]: createSendButton,
		[Button.FILE_ATTACHMENT_BUTTON]: createFileAttachmentButton,
		[Button.EMOJI_PICKER_BUTTON]: createEmojiButton
	};

	const baseSettings = {
		audio: { disabled: false },
		general: { embedded: false },
		emoji: { disabled: false },
		fileAttachment: { disabled: false },
		notification: { disabled: false },
		voice: { disabled: false },
		header: { buttons: [Button.AUDIO_BUTTON, Button.EMOJI_PICKER_BUTTON] },
		chatInput: { buttons: [Button.SEND_MESSAGE_BUTTON, Button.CLOSE_CHAT_BUTTON] },
		footer: { buttons: [Button.VOICE_MESSAGE_BUTTON]}
	};

	it('should return buttons based on settings', () => {
		const buttonConfig = getButtonConfig(baseSettings, buttonComponentMap);

		expect(buttonConfig.header).toHaveLength(2); // Expect two header buttons
		expect(buttonConfig.header[0]).toBeTruthy(); // Check if the first header button is rendered
		expect(buttonConfig.chatInput).toHaveLength(2); // Expect two chat input buttons
		expect(buttonConfig.footer).toHaveLength(1); // Expect one footer button
	});

	it('should handle disabled buttons correctly', () => {
		const alteredSettings = {
			...baseSettings,
			audio: { disabled: true }, // Disabling audio button
			closeChat: { disabled: true },
			general: {
				embedded: true
			}// Disabling close chat button
		};

		const buttonConfig = getButtonConfig(alteredSettings, buttonComponentMap);

		expect(buttonConfig.header).toHaveLength(1); // Only emoji button should be present
		expect(buttonConfig.chatInput).toHaveLength(1); // Only the send button should be present
		expect(buttonConfig.footer).toHaveLength(1); // Voice button should still be there
	});

	it('should handle missing button configurations', () => {
		const emptySettings = {
			...baseSettings,
			header: { buttons: [] }, // No header buttons defined
			chatInput: { buttons: [] }, // No chat input buttons defined
			footer: { buttons: [] } // No footer buttons defined
		};

		const buttonConfig = getButtonConfig(emptySettings, buttonComponentMap);

		expect(buttonConfig.header).toHaveLength(0); // Should be empty
		expect(buttonConfig.chatInput).toHaveLength(0); // Should be empty
		expect(buttonConfig.footer).toHaveLength(0); // Should be empty
	});
});
