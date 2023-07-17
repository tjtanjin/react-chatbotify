import { Options } from "../types/Options";

import logo from "../assets/logo.png";
import actionDisabledImage from "../assets/action_disabled_icon.png";
import botAvatarImage from "../assets/bot_avatar.png";
import userAvatarImage from "../assets/user_avatar.svg";
import chatImage from "../assets/chat_icon.svg";
import fileAttachmentImage from "../assets/file_attachment_icon.svg";
import notificationImage from "../assets/notification_icon.svg";
import closeChatImage from "../assets/close_chat_icon.svg";
import sendButtonImage from "../assets/send_icon.svg";
import voiceImage from "../assets/voice_icon.svg";
import audioImage from "../assets/audio_icon.svg";
import notificationSound from "../assets/notification_sound.wav";

// default options provided to the bot
const defaultOptions = {
	// tracks state of chat window, also the default state to load it in
	isOpen: false,

	// configurations
	theme: {
		primaryColor: "#42b0c5",
		secondaryColor: "#491d8d",
		fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", ' +
			'"Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", ' +
			'sans-serif',
		actionDisabledImage: actionDisabledImage,
		embedded: false,
	},
	tooltip: {
		mode: "CLOSE",
		text: "Talk to me! 😊",
	},
	chatButton: {
		chatButtonImage: chatImage,
	},
	header: {
		title: (
			<h3 style={{cursor: "pointer", margin: 0}} onClick={
				() => window.open("https://tjtanjin.com")
			}>tjtanjin
			</h3>
		),
		showAvatar: true,
		avatarImage: botAvatarImage,
		notificationImage: notificationImage,
		closeChatImage: closeChatImage,
	},
	notification: {
		disabled: false,
		defaultToggledOn: true,
		toggledOn: true,
		notificationSound: notificationSound,
	},
	audio: {
		disabled: true,
		defaultToggledOn: false,
		language: "en-US",
		voiceName: "Google US English Male",
		rate: 1,
		audioImage: audioImage,
	},
	chatHistory: {
		disabled: false,
		maxEntries: 30,
		storageKey: "rcb-history",
		viewChatHistoryButtonText: "Load Chat History",
		chatHistoryLineBreakText: "----- Previous Chat History -----",
	},
	chatInput: {
		disabled: false,
		enabledPlaceholderText: "Type your message...",
		disabledPlaceholderText: "",
		botDelay: 1000,
		sendButtonImage: sendButtonImage,
		blockSpam: true,
		sendOptionOutput: true,
		sendCheckboxOutput: true,
	},
	userBubble: {
		showAvatar: false,
		avatarImage: userAvatarImage,
	},
	botBubble: {
		showAvatar: false,
		avatarImage: botAvatarImage,
	},
	voice: {
		disabled: false,
		defaultToggledOn: false,
		timeoutPeriod: 60000,
		autoSendDisabled: false,
		autoSendPeriod: 1000,
		voiceImage: voiceImage,
	},
	footer: {
		text: (
			<div style={{cursor: "pointer"}} 
				onClick={() => window.open("https://tjtanjin.com")}
			>
				<span>Powered By </span>
				<span style={{fontWeight: "bold"}}>
					<img style={{width: 10, height: 10}} src={logo}></img>
					<span> React ChatBotify</span>
				</span>
			</div>
		),
		fileAttachmentImage: fileAttachmentImage,
	},
	fileAttachment: {
		disabled: false,
		multiple: true,
		accept: ".png",
	},
	emoji: {
		disabled: false,
		icon: "😀",
		list: ['😀', '😃', '😄', '😊', '😍', '🥳', '🎉', '🎈', '🚀', '⭐️']
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
	headerStyle: {},
	chatWindowStyle: {},
	chatInputStyle: {},
	userBubbleStyle: {},
	botBubbleStyle: {},
	botOptionStyle: {},
	botOptionHoveredStyle: {},
	botCheckBoxRowStyle: {},
	botCheckBoxNextStyle: {},
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

	return getCombinedOptions(defaultOptions as Options, providedOptions);
}

/**
 * Combines default and provided options.
 * 
 * @param defaultOptions default options for the bot
 * @param providedOptions options provided by the user to the bot
 */
function getCombinedOptions<T>(defaultOptions: T, providedOptions: T): T {
	const mergedObj: T = {} as T;

	for (const prop in defaultOptions) {
		if (!Object.prototype.hasOwnProperty.call(providedOptions, prop)) {
			mergedObj[prop] = defaultOptions[prop];
		}
	}

	for (const prop in providedOptions) {
		if (typeof defaultOptions[prop] === "object" && typeof providedOptions[prop] === "object") {
			mergedObj[prop] = getCombinedOptions(defaultOptions[prop], providedOptions[prop]);
		} else {
			mergedObj[prop] = providedOptions[prop];
		}
	}

	return mergedObj;
}