import { Options } from "../types/Options";

import chatButton from "../assets/chat_button.png";
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
		buttons: ["audio-button", "notification-button", "close-chat-button"],
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
		showCharacterCount: false,
		characterLimit: -1,
		botDelay: 1000,
		sendButtonIcon: sendButtonIcon,
		blockSpam: true,
		sendOptionOutput: true,
		sendCheckboxOutput: true,
		sendAttachmentOutput: true,
		buttons: ["voice", "send"]
	},
	chatWindow: {
		showScrollbar: false,
		autoJumpToBottom: false,
		showMessagePrompt: true,
		messagePromptText: "New Messages ↓",
		messagePromptOffset: 30,
	},
	userBubble: {
		animate: true,
		showAvatar: false,
		avatar: userAvatar,
		simStream: false,
		streamSpeed: 30,
	},
	botBubble: {
		animate: true,
		showAvatar: false,
		avatar: botAvatar,
		simStream: false,
		streamSpeed: 30,
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
					<img style={{width: 10, height: 10}} src={chatButton}></img>
					<span> React ChatBotify</span>
				</span>
			</div>
		),
		buttons: ["file-attachment","emoji-picker"]
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
	chatInputAreaFocusedStyle: {},
	chatInputAreaDisabledStyle: {},
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
	characterLimitStyle: {},
	characterLimitReachedStyle: {},
	chatHistoryButtonStyle: {},
	chatHistoryButtonHoveredStyle: {},
	chatHistoryLineBreakStyle: {},
	chatMessagePromptStyle: {},
	chatMessagePromptHoveredStyle: {},
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
 * Retrieves the options for a theme via CDN.
 * 
 * @param theme theme to retrieve options for
 */
const getThemeOptions = async (theme: string): Promise<Options> => {
	// prepare json and css urls
	const cdnUrl = "https://cdn.jsdelivr.net/gh/tjtanjin/react-chatbotify-themes/themes"
	const jsonFile = "options.json";
	const cssFile = "styles.css";
	const jsonUrl = `${cdnUrl}/${theme}/${jsonFile}`;
	const cssUrl = `${cdnUrl}/${theme}/${cssFile}`;

	// load css
	const link = document.createElement('link');
	link.rel = 'stylesheet';
	link.href = cssUrl;
	document.head.appendChild(link);

	// load json
	try {
		const response = await fetch(jsonUrl);
		if (!response.ok) {
			console.log(`Failed to fetch theme ${theme}`);
			return {}
		}
		return await response.json();
	} catch (error) {
		console.log(`Failed to fetch theme ${theme}`);
		return {}
	}
}

/**
 * Parses default options with user provided options to generate final bot options.
 * 
 * @param providedOptions options provided by the user to the bot
 * @param theme theme provided by the user to the bot
 */
export const parseBotOptions = async (providedOptions: Options | undefined,
	theme: string | undefined | Array<string>): Promise<Options> => {
	
	// if no provided options or theme, then just load default options
	if (providedOptions == null && theme == null) {
		return defaultOptions;
	}

	let combinedOptions: Options = defaultOptions;
	if (theme != null) {
		if (Array.isArray(theme)) {
			for (const selectedTheme of theme) {
				const themeOptions = await getThemeOptions(selectedTheme);
				combinedOptions = getCombinedOptions(themeOptions, defaultOptions);
			}
		} else {
			const themeOptions = await getThemeOptions(theme);
			combinedOptions = getCombinedOptions(themeOptions, defaultOptions);
		}
	}

	if (providedOptions != null) {
		combinedOptions = getCombinedOptions(providedOptions, combinedOptions);
	}

	// enforces value for bot delay does not go below 500
	if (combinedOptions.chatInput?.botDelay != null && combinedOptions.chatInput?.botDelay < 500) {
		combinedOptions.chatInput.botDelay = 500;
	}

	return combinedOptions;
}

/**
 * Combines default and provided options.
 * 
 * @param providedOptions options provided by the user to the bot
 * @param baseOptions the base options that the provided options will overwrite
 */
const getCombinedOptions = (preferredOptions: Options, baseOptions: Options): Options => {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const stack: Array<{ source: any, target: any }> = [{ source: preferredOptions, target: baseOptions }];
	
	while (stack.length > 0) {
		const poppedItem = stack.pop();
		if (poppedItem == null) {
			continue;
		}

		const { source, target } = poppedItem;
		for (const key in source) {
			if (!Object.prototype.hasOwnProperty.call(source, key)) {
				continue;
			}

			if (typeof source[key] === 'object' && source[key] !== null && key !== 'buttons') {
				if (!target[key]) {
					target[key] = Array.isArray(source[key]) ? [] : {};
				}
				stack.push({ source: source[key], target: target[key] });
			} else {
				target[key] = source[key];
			}
		}
	}

	return baseOptions;
}