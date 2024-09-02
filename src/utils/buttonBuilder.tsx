import { Dispatch, RefObject, SetStateAction } from "react";

import FileAttachmentButton from "../components/Buttons/FileAttachmentButton/FileAttachmentButton";
import EmojiButton from "../components/Buttons/EmojiButton/EmojiButton";
import AudioButton from "../components/Buttons/AudioButton/AudioButton";
import CloseChatButton from "../components/Buttons/CloseChatButton/CloseChatButton";
import NotificationButton from "../components/Buttons/NotificationButton/NotificationButton";
import VoiceButton from "../components/Buttons/VoiceButton/VoiceButton";
import SendButton from "../components/Buttons/SendButton/SendButton";
import { ButtonConfig } from "../types/internal/ButtonConfig";
import { Settings } from "../types/Settings";
import { Flow } from "../types/Flow";
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

export const createAudioButton = (
	audioToggledOn: boolean,
	setAudioToggledOn: Dispatch<SetStateAction<boolean>>
) => {
	return (
		<AudioButton audioToggledOn={audioToggledOn} setAudioToggledOn={setAudioToggledOn}/>
	)
}

export const createNotificationButton = (
	notificationToggledOn: boolean,
	setNotificationToggledOn: Dispatch<SetStateAction<boolean>>
) => {
	return (
		<NotificationButton notificationToggledOn={notificationToggledOn}
			setNotificationToggledOn={setNotificationToggledOn}
		/>
	)
}

export const createCloseChatButton = () => {
	return (
		<CloseChatButton/>
	)
}

export const createVoiceButton = (
	inputRef: RefObject<HTMLTextAreaElement | HTMLInputElement>,
	textAreaDisabled: boolean,
	voiceToggledOn: boolean,
	handleToggleVoice: () => void,
	getCurrPath: () => keyof Flow | null,
	handleActionInput: (path: keyof Flow, userInput: string, sendUserInput?: boolean) => Promise<void>,
	injectMessage: (content: string | JSX.Element, sender?: string) => Promise<void>,
	setInputLength: Dispatch<SetStateAction<number>>,
) => {
	return (
		<VoiceButton inputRef={inputRef} textAreaDisabled={textAreaDisabled} voiceToggledOn={voiceToggledOn}
			handleToggleVoice={handleToggleVoice} getCurrPath={getCurrPath} 
			handleActionInput={handleActionInput}  injectMessage={injectMessage} setInputLength={setInputLength}
		/>
	)
}

export const createSendButton = (
	handleSubmit: () => void
) => {
	return (<SendButton handleSubmit={handleSubmit}/>)
}

export const createFileAttachmentButton = (
	inputRef: RefObject<HTMLTextAreaElement | HTMLInputElement>,
	flow: Flow,
	blockAllowsAttachment: boolean,
	injectMessage: (content: string | JSX.Element, sender?: string) => Promise<void>,
	streamMessage: (content: string | JSX.Element, sender?: string) => Promise<void>,
	openChat: (isOpen: boolean) => void,
	getCurrPath: () => keyof Flow | null,
	getPrevPath: () => keyof Flow | null,
	goToPath: (pathToGo: keyof Flow) => void,
	setTextAreaValue: (value: string) => void,
	handleActionInput: (path: keyof Flow, userInput: string, sendUserInput?: boolean) => Promise<void>
) => {
	return (
		<FileAttachmentButton inputRef={inputRef} flow={flow} 
			blockAllowsAttachment={blockAllowsAttachment} getCurrPath={getCurrPath} openChat={openChat}
			getPrevPath={getPrevPath} goToPath={goToPath} handleActionInput={handleActionInput}
			injectMessage={injectMessage} streamMessage={streamMessage} setTextAreaValue={setTextAreaValue}
		/>
	);
};
  
export const createEmojiButton = (
	inputRef: RefObject<HTMLTextAreaElement | HTMLInputElement>,
	textAreaDisabled: boolean
) => {
	return (
		<EmojiButton inputRef={inputRef} textAreaDisabled={textAreaDisabled}/>
	);
};