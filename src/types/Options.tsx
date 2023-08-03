/**
 * Defines the configurable options/styles for the chat bot.
 */
export type Options = {
	// tracks state of chat window, also the default state to load it in
	isOpen?: boolean;

	// configurations
	theme?: {
		primaryColor?: string;
		secondaryColor?: string;
		fontFamily?: string;
		showHeader?: boolean;
		showFooter?: boolean;
		showInputRow?: boolean,
		actionDisabledIcon?: string;
		embedded?: boolean;
		desktopEnabled?: boolean;
		mobileEnabled?: boolean;
	},
	tooltip?: {
		mode?: string;
		text?: string;
	},
	chatButton?: {
		icon: string;
	},
	header?: {
		title?: string | JSX.Element,
		showAvatar: boolean,
		avatar?: string;
		closeChatIcon?: string;
	},
	notification?: {
		disabled?: boolean;
		defaultToggledOn?: boolean;
		volume?: number;
		icon?: string;
		sound?: string;
	},
	audio?: {
		disabled?: boolean;
		defaultToggledOn?: boolean;
		language?: string;
		voiceNames?: string[];
		rate?: number;
		volume?: number;
		icon?: string;
	},
	chatHistory?: {
		disabled?: boolean;
		maxEntries?: number;
		storageKey?: string;
		viewChatHistoryButtonText?: string;
		chatHistoryLineBreakText?: string;
	},
	chatInput?: {
		disabled?: boolean;
		enabledPlaceholderText?: string;
		disabledPlaceholderText?: string;
		botDelay?: number;
		sendButtonIcon?: string;
		blockSpam?: boolean;
		sendOptionOutput?: boolean;
		sendCheckboxOutput?: boolean;
		sendAttachmentOutput?: boolean;
	},
	userBubble?: {
		showAvatar?: boolean;
		avatar?: string;
	},
	botBubble?: {
		showAvatar?: boolean;
		avatar?: string;
	},
	voice?: {
		disabled?: boolean;
		defaultToggledOn?: boolean;
		timeoutPeriod?: number;
		autoSendDisabled?: boolean;
		autoSendPeriod?: number;
		icon?: string;
	},
	footer?: {
		text?: string | JSX.Element;
	},
	fileAttachment?: {
		disabled?: boolean;
		multiple?: boolean;
		accept?: string;
		icon?: string;
	}
	emoji?: {
		disabled?: boolean;
		icon?: string;
		list?: string[] ;
	},
	advance?: {
		useCustomMessages?: boolean;
		useCustomBotOptions?: boolean;
		useCustomPaths?: boolean;
	},

	// styles
	tooltipStyle?: {
		[key: string]: string | number;
	},
	chatButtonStyle?: {
		[key: string]: string | number;
	},
	notificationBadgeStyle?: {
		[key: string]: string | number;
	},
	chatWindowStyle?: {
		[key: string]: string | number;
	},
	headerStyle?: {
		[key: string]: string | number;
	},
	bodyStyle?: {
		[key: string]: string | number;
	},
	chatInputContainerStyle?: {
		[key: string]: string | number;
	},
	chatInputAreaStyle?: {
		[key: string]: string | number;
	},
	userBubbleStyle?: {
		[key: string]: string | number;
	},
	botBubbleStyle?: {
		[key: string]: string | number;
	},
	botOptionStyle?: {
		[key: string]: string | number;
	},
	botOptionHoveredStyle?: {
		[key: string]: string | number;
	},
	botCheckboxRowStyle?: {
		[key: string]: string | number;
	},
	botCheckboxNextStyle?: {
		[key: string]: string | number;
	},
	botCheckMarkStyle?: {
		[key: string]: string | number;
	},
	botCheckMarkSelectedStyle?: {
		[key: string]: string | number;
	},
	sendButtonStyle?: {
		[key: string]: string | number;
	},
	sendButtonHoveredStyle?: {
		[key: string]: string | number;
	},
	chatHistoryButtonStyle?: {
		[key: string]: string | number;
	},
	chatHistoryButtonHoveredStyle?: {
		[key: string]: string | number;
	},
	chatHistoryLineBreakStyle?: {
		[key: string]: string | number;
	},
	footerStyle?: {
		[key: string]: string | number;
	},
	loadingSpinnerStyle?: {
		[key: string]: string | number;
	}
}