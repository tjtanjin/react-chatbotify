import { Options } from "../types/Options";

import logo from "../assets/logo.png";
import actionDisabledIcon from "../assets/action_disabled_icon.png";
import botAvatar from "../assets/bot_avatar.png";
import userAvatar from "../assets/user_avatar.svg";
import chatIcon from "../assets/chat_icon.svg";
import fileAttachmentIcon from "../assets/file_attachment_icon.svg";
import notificationIcon from "../assets/notification_icon.svg";
import closeChatIcon from "../assets/close_chat_icon.svg";
import sendButtonIcon from "../assets/send_icon.svg";
import voiceIcon from "../assets/voice_icon.svg";
import emojiIcon from "../assets/emoji_icon.svg";
import audioIcon from "../assets/audio_icon.svg";
import notificationSound from "../assets/notification_sound.wav";

// default options provided to the bot
const defaultOptions = {
	// tracks state of chat window, also the default state to load it in
	isOpen: false,

	// configurations
	theme: {
		primaryColor: "#42b0c5",
		secondaryColor: "#491d8d",
		fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', " +
			"'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', " +
			"sans-serif",
		showHeader: true,
		showFooter: true,
		showInputRow: true,
		actionDisabledIcon: actionDisabledIcon,
		embedded: false,
		desktopEnabled: true,
		mobileEnabled: true,
	},
	tooltip: {
		mode: "CLOSE",
		text: "Talk to me! 😊",
	},
	chatButton: {
		icon: chatIcon,
	},
	header: {
		title: (
			<h3 style={{cursor: "pointer", margin: 0}} onClick={
				() => window.open("https://github.com/tjtanjin/")
			}>Tan Jin
			</h3>
		),
		showAvatar: true,
		avatar: botAvatar,
		closeChatIcon: closeChatIcon,
	},
	notification: {
		disabled: false,
		defaultToggledOn: true,
		volume: 0.2,
		icon: notificationIcon,
		sound: notificationSound,
	},
	audio: {
		disabled: true,
		defaultToggledOn: false,
		language: "en-US",
		voiceNames: ["Microsoft David - English (United States)", "Alex (English - United States)"],
		rate: 1,
		volume: 1,
		icon: audioIcon,
	},
	chatHistory: {
		disabled: false,
		maxEntries: 30,
		storageKey: "rcb-history",
		viewChatHistoryButtonText: "Load Chat History ⟳",
		chatHistoryLineBreakText: "----- Previous Chat History -----",
	},
	chatInput: {
		disabled: false,
		enabledPlaceholderText: "Type your message...",
		disabledPlaceholderText: "",
		botDelay: 1000,
		sendButtonIcon: sendButtonIcon,
		blockSpam: true,
		sendOptionOutput: true,
		sendCheckboxOutput: true,
		sendAttachmentOutput: true,
	},
	userBubble: {
		showAvatar: false,
		avatar: userAvatar,
	},
	botBubble: {
		showAvatar: false,
		avatar: botAvatar,
	},
	voice: {
		disabled: true,
		defaultToggledOn: false,
		timeoutPeriod: 10000,
		autoSendDisabled: false,
		autoSendPeriod: 1000,
		icon: voiceIcon,
	},
	footer: {
		text: (
			<div style={{cursor: "pointer"}} 
				onClick={() => window.open("https://react-chatbotify.tjtanjin.com")}
			>
				<span>Powered By </span>
				<span style={{fontWeight: "bold"}}>
					<img style={{width: 10, height: 10}} src={logo}></img>
					<span> React ChatBotify</span>
				</span>
			</div>
		),
	},
	fileAttachment: {
		disabled: false,
		multiple: true,
		accept: ".png",
		icon: fileAttachmentIcon,
	},
	emoji: {
		disabled: false,
		icon: emojiIcon,
		list: ["😀", "😃", "😄", "😅", "😊", "😌", "😇", "🙃", "🤣", "😍", "🥰", "🥳", "🎉", "🎈", "🚀", "⭐️"]
	},
	advance: {
		useCustomMessages: false,
		useCustomBotOptions: false,
		useCustomPaths: false,
	},

	// styles
	tooltipStyle: {},
	chatButtonStyle: {},
	notificationBadgeStyle: {},
	chatWindowStyle: {},
	headerStyle: {},
	bodyStyle: {},
	chatInputContainerStyle: {},
	chatInputAreaStyle: {},
	userBubbleStyle: {},
	botBubbleStyle: {},
	botOptionStyle: {},
	botOptionHoveredStyle: {},
	botCheckboxRowStyle: {},
	botCheckboxNextStyle: {},
	botCheckMarkStyle: {},
	botCheckMarkSelectedStyle: {},
	sendButtonStyle: {},
	sendButtonHoveredStyle: {},
	chatHistoryButtonStyle: {},
	chatHistoryButtonHoveredStyle: {},
	chatHistoryLineBreakStyle: {},
	footerStyle: {},
	loadingSpinnerStyle: {},
}

/**
 * Retrieves default values for bot options.
 */
export const getDefaultBotOptions = () => {
	return defaultOptions;
}

/**
 * Parses default options with user provided options to generate final bot options.
 * 
 * @param providedOptions options provided by the user to the bot
 */
export const parseBotOptions = (providedOptions: Options | undefined) => {
	if (providedOptions == null) {
		return defaultOptions;
	}

	// enforces value for bot delay does not go below 500
	if (providedOptions.chatInput?.botDelay != null && providedOptions.chatInput?.botDelay < 500) {
		providedOptions.chatInput.botDelay = 500;
	}

	return getCombinedOptions(providedOptions);
}

/**
 * Combines default and provided options.
 * 
 * @param providedOptions options provided by the user to the bot
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getCombinedOptions = (providedOptions: any): Options => {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const mergedOptions: any = { ...defaultOptions };
	for (const prop in providedOptions) {
		if (typeof providedOptions[prop] === "object" && providedOptions[prop] !== null) {
			mergedOptions[prop] = { ...mergedOptions[prop], ...providedOptions[prop] };
		} else {
			mergedOptions[prop] = providedOptions[prop];
		}
	}
	return mergedOptions;
}