import FileAttachmentButton from "../components/Buttons/FileAttachmentButton/FileAttachmentButton";
import EmojiButton from "../components/Buttons/EmojiButton/EmojiButton";
import AudioButton from "../components/Buttons/AudioButton/AudioButton";
import CloseChatButton from "../components/Buttons/CloseChatButton/CloseChatButton";
import NotificationButton from "../components/Buttons/NotificationButton/NotificationButton";
import VoiceButton from "../components/Buttons/VoiceButton/VoiceButton";
import SendButton from "../components/Buttons/SendButton/SendButton";
import { ButtonConfig } from "../types/internal/ButtonConfig";
import { Settings } from "../types/Settings";
import { Button } from "../constants/Button";

// type guard to check if a value is a button key
const isButton = (value: string): value is (keyof typeof Button) => {
	return Object.values(Button).includes(value);
};

/**
 * Retrieves the button configurations for header, chat input and footer then builds the buttons.
 * @param settings options provided to the bot to determine buttons shown
 * @param buttonComponentMap a mapping between default buttons and their components
 */
export const getButtonConfig = (
	settings: Settings,
	buttonComponentMap: {[x: string]: () => JSX.Element}
): ButtonConfig => {
	const buttonDisabledMap = {
		[Button.AUDIO_BUTTON]: settings.audio?.disabled,
		[Button.CLOSE_CHAT_BUTTON]: settings.general?.embedded,
		[Button.EMOJI_PICKER_BUTTON]: settings.emoji?.disabled,
		[Button.FILE_ATTACHMENT_BUTTON]: settings.fileAttachment?.disabled,
		[Button.NOTIFICATION_BUTTON]: settings.notification?.disabled,
		[Button.SEND_MESSAGE_BUTTON]: false,
		[Button.VOICE_MESSAGE_BUTTON]: settings.voice?.disabled
	};

	// cache to store created buttons
	const buttonCache: { [key: string]: JSX.Element } = {};

	const mapButtons = (buttons: Array<string | JSX.Element> | undefined) => {
		if (!buttons) {
			return [];
		}

		return buttons
			.map(button => {
				// for each default button present, check if it is enabled
				if (typeof button === "string") {
					if (isButton(button) && !buttonDisabledMap[button]) {
						if (buttonCache[button]) {
							return buttonCache[button];
						}
						const buttonCondition = buttonComponentMap[button];
						if (typeof buttonCondition === "function") {
							const createdButton = buttonCondition();
							buttonCache[button] = createdButton;
							return createdButton;
						}
						return null;
					}
					return null;
				}

				// if custom button, nothing to check
				return button;
			})
			.filter((button) => button !== null) as JSX.Element[];
	};

	const headerButtons = mapButtons(settings.header?.buttons);
	const chatInputButtons = mapButtons(settings.chatInput?.buttons);
	const footerButtons = mapButtons(settings.footer?.buttons);

	return { header: headerButtons, chatInput: chatInputButtons, footer: footerButtons };
}

// functions below are self-explanatory (used to create the default button components)

export const createAudioButton = () => <AudioButton/>
export const createNotificationButton = () => <NotificationButton/>
export const createCloseChatButton = () => <CloseChatButton/>
export const createVoiceButton = () => <VoiceButton/>
export const createSendButton = () => <SendButton/>
export const createFileAttachmentButton = () => <FileAttachmentButton/>
export const createEmojiButton = () => <EmojiButton/>