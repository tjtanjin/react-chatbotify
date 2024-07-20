import { Dispatch, RefObject, SetStateAction } from "react";

import FileAttachmentButton from "../components/Buttons/FileAttachmentButton/FileAttachmentButton";
import EmojiButton from "../components/Buttons/EmojiButton/EmojiButton";
import AudioButton from "../components/Buttons/AudioButton/AudioButton";
import CloseChatButton from "../components/Buttons/CloseChatButton/CloseChatButton";
import NotificationButton from "../components/Buttons/NotificationButton/NotificationButton";
import VoiceButton from "../components/Buttons/VoiceButton/VoiceButton";
import SendButton from "../components/Buttons/SendButton/SendButton";
import { ButtonConfig } from "../types/internal/ButtonConfig";
import { Options } from "../types/Options";
import { Flow } from "../types/Flow";
import { Button } from "../constants/Button";

// type guard to check if a value is a button key
const isButton = (value: string): value is (keyof typeof Button) => {
	return Object.values(Button).includes(value);
};

/**
 * Retrieves the button configurations for header, chat input and footer then builds the buttons.
 * @param botOptions options provided to the bot to determine buttons shown
 * @param buttonComponentMap a mapping between default buttons and their components
 */
export const getButtonConfig = (
	botOptions: Options,
	buttonComponentMap: {[x: string]: () => JSX.Element}
): ButtonConfig => {
	const buttonDisabledMap = {
		[Button.AUDIO_BUTTON]: botOptions.audio?.disabled,
		[Button.CLOSE_CHAT_BUTTON]: botOptions.theme?.embedded,
		[Button.EMOJI_PICKER_BUTTON]: botOptions.emoji?.disabled,
		[Button.FILE_ATTACHMENT_BUTTON]: botOptions.fileAttachment?.disabled,
		[Button.NOTIFICATION_BUTTON]: botOptions.notification?.disabled,
		[Button.SEND_MESSAGE_BUTTON]: false,
		[Button.VOICE_MESSAGE_BUTTON]: botOptions.voice?.disabled
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
				if (typeof button === "string" && isButton(button) && !buttonDisabledMap[button]) {
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

				// if custom button, nothing to check
				return button;
			})
			.filter((button) => button !== null) as JSX.Element[];
	};

	const headerButtons = mapButtons(botOptions.header?.buttons);
	const chatInputButtons = mapButtons(botOptions.chatInput?.buttons);
	const footerButtons = mapButtons(botOptions.footer?.buttons);

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
	handleActionInput: (path: keyof Flow, userInput: string, sendUserInput?: boolean) => Promise<void>
) => {
	return (
		<FileAttachmentButton inputRef={inputRef} flow={flow} 
			blockAllowsAttachment={blockAllowsAttachment} getCurrPath={getCurrPath} openChat={openChat}
			getPrevPath={getPrevPath} handleActionInput={handleActionInput} injectMessage={injectMessage}
			streamMessage={streamMessage}
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