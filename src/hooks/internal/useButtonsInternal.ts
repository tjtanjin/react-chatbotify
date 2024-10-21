import { useMemo } from "react";

import {
	createAudioButton,
	createCloseChatButton,
	createEmojiButton,
	createFileAttachmentButton,
	createNotificationButton,
	createSendButton,
	createVoiceButton,
	getButtonConfig
} from "../../utils/buttonBuilder";
import { useSettingsContext } from "../../context/SettingsContext";
import { Button } from "../../constants/Button";

/**
 * Internal custom hook for creating buttons.
 */
export const useButtonInternal = () => {
	// handles settings
	const { settings } = useSettingsContext();

	// handles the rendering of buttons
	const staticButtonComponentMap = useMemo(() => ({
		[Button.CLOSE_CHAT_BUTTON]: () => createCloseChatButton(),
		[Button.AUDIO_BUTTON]: () => createAudioButton(),
		[Button.NOTIFICATION_BUTTON]: () => createNotificationButton(),
		[Button.EMOJI_PICKER_BUTTON]: () => createEmojiButton(),
		[Button.FILE_ATTACHMENT_BUTTON]: () => createFileAttachmentButton(),
		[Button.SEND_MESSAGE_BUTTON]: () => createSendButton(),
		[Button.VOICE_MESSAGE_BUTTON]: () => createVoiceButton()
	}), []);

	// computes button configurations whenever settings or map changes
	const { header, chatInput, footer } = useMemo(() => {
		return getButtonConfig(settings, staticButtonComponentMap);
	}, [settings, staticButtonComponentMap]);

	// memoizes creation of jsx elements
	const headerButtons = useMemo(() => header, [header]);
	const chatInputButtons = useMemo(() => chatInput, [chatInput]);
	const footerButtons = useMemo(() => footer, [footer]);

	return { headerButtons, chatInputButtons, footerButtons };
};
