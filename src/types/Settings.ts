/**
 * Defines the configurable options/styles for the chat bot.
 */
export type Settings = {
	// tracks state of chat window, also the default state to load it in
	isOpen?: boolean;

	// configurations
	general?: {
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
		buttons?: Array<JSX.Element | string>;
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
		buttons?: Array<JSX.Element | string>;
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
		buttons?: Array<JSX.Element | string>;
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
		useAdvancedMessages?: boolean;
		useAdvancedSettings?: boolean;
		useAdvancedPaths?: boolean;
		useAdvancedStyles?: boolean;
	}
}