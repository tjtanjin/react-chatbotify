import { useEffect, useMemo, useState } from "react";

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
import { Flow } from "../../types/Flow";
import { Button } from "../../constants/Button";

/**
 * Internal custom hook for creating buttons.
 */
export const useButtonInternal = (flow: Flow) => {
	const { settings } = useSettingsContext();

	// buttons to show in header, chat input and footer
	const [headerButtons, setHeaderButtons] = useState<Array<JSX.Element>>([]);
	const [chatInputButtons, setChatInputButtons] = useState<Array<JSX.Element>>([]);
	const [footerButtons, setFooterButtons] = useState<Array<JSX.Element>>([]);
	
	// handles the rendering of buttons
	const staticButtonComponentMap = useMemo(() => ({
		[Button.CLOSE_CHAT_BUTTON]: () => createCloseChatButton(),
		[Button.AUDIO_BUTTON]: () => createAudioButton(),
		[Button.NOTIFICATION_BUTTON]: () => createNotificationButton(),
		[Button.EMOJI_PICKER_BUTTON]: () => createEmojiButton(),
		[Button.FILE_ATTACHMENT_BUTTON]: () => createFileAttachmentButton(flow),
		[Button.SEND_MESSAGE_BUTTON]: () => createSendButton(flow),
		[Button.VOICE_MESSAGE_BUTTON]: () => createVoiceButton(flow)
	}), []);

	// sets buttons to be shown
	useEffect(() => {
		const buttonConfig = getButtonConfig(settings, staticButtonComponentMap);
		setHeaderButtons(buttonConfig.header);
		setChatInputButtons(buttonConfig.chatInput);
		setFooterButtons(buttonConfig.footer);
	}, [settings, staticButtonComponentMap]);

	return {headerButtons, chatInputButtons, footerButtons};
};
