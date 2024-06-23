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
		showInputRow?: boolean;
		actionDisabledIcon?: string;
		embedded?: boolean;
		desktopEnabled?: boolean;
		mobileEnabled?: boolean;
		flowStartTrigger?: string;
	},
	tooltip?: {
		mode?: string;
		text?: string;
	},
	chatButton?: {
		icon: string;
	},
	header?: {
		title?: string | JSX.Element;
		showAvatar?: boolean;
		avatar?: string;
		closeChatIcon?: string;
	},
	notification?: {
		disabled?: boolean;
		defaultToggledOn?: boolean;
		volume?: number;
		icon?: string;
		sound?: string;
		showCount?: boolean;
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
		autoLoad?: boolean;
	},
	chatInput?: {
		disabled?: boolean;
		allowNewline?: boolean;
		enabledPlaceholderText?: string;
		disabledPlaceholderText?: string;
		showCharacterCount?: boolean;
		characterLimit?: number;
		botDelay?: number;
		sendButtonIcon?: string;
		blockSpam?: boolean;
		sendOptionOutput?: boolean;
		sendCheckboxOutput?: boolean;
		sendAttachmentOutput?: boolean;
	},
	chatWindow?: {
		showScrollbar?: boolean;
		autoJumpToBottom?: boolean;
		showMessagePrompt?: boolean;
		messagePromptText?: string;
		messagePromptOffset?: number;
	},
	sensitiveInput?: {
		maskInTextArea?: boolean;
		maskInUserBubble?: boolean;
		asterisksCount?: number;
		hideInUserBubble?: boolean;
	},
	userBubble?: {
		animate?: boolean;
		showAvatar?: boolean;
		avatar?: string;
		simStream?: boolean;
		streamSpeed? :number;
		dangerouslySetInnerHtml?: boolean;
	},
	botBubble?: {
		animate?: boolean;
		showAvatar?: boolean;
		avatar?: string;
		simStream?: boolean;
		streamSpeed? :number;
		dangerouslySetInnerHtml?: boolean;
	},
	voice?: {
		disabled?: boolean;
		defaultToggledOn?: boolean;
		language?: string;
		timeoutPeriod?: number;
		autoSendDisabled?: boolean;
		autoSendPeriod?: number;
		sendAsAudio?: boolean;
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
		showMediaDisplay?: boolean;
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
	tooltipStyle?: React.CSSProperties;
	chatButtonStyle?: React.CSSProperties;
	notificationBadgeStyle?: React.CSSProperties;
	chatWindowStyle?: React.CSSProperties;
	headerStyle?: React.CSSProperties;
	bodyStyle?: React.CSSProperties;
	chatInputContainerStyle?: React.CSSProperties;
	chatInputAreaStyle?: React.CSSProperties;
	chatInputAreaFocusedStyle?: React.CSSProperties;
	chatInputAreaDisabledStyle?: React.CSSProperties;
	userBubbleStyle?: React.CSSProperties;
	botBubbleStyle?: React.CSSProperties;
	botOptionStyle?: React.CSSProperties;
	botOptionHoveredStyle?: React.CSSProperties;
	botCheckboxRowStyle?: React.CSSProperties;
	botCheckboxNextStyle?: React.CSSProperties;
	botCheckMarkStyle?: React.CSSProperties;
	botCheckMarkSelectedStyle?: React.CSSProperties;
	sendButtonStyle?: React.CSSProperties;
	sendButtonHoveredStyle?: React.CSSProperties;
	characterLimitStyle?: React.CSSProperties;
	characterLimitReachedStyle?: React.CSSProperties;
	chatHistoryButtonStyle?: React.CSSProperties;
	chatHistoryButtonHoveredStyle?: React.CSSProperties;
	chatHistoryLineBreakStyle?: React.CSSProperties;
	chatMessagePromptStyle?: React.CSSProperties;
	chatMessagePromptHoveredStyle?: React.CSSProperties;
	footerStyle?: React.CSSProperties;
	loadingSpinnerStyle?: React.CSSProperties;
	mediaDisplayContainerStyle?: React.CSSProperties;
}