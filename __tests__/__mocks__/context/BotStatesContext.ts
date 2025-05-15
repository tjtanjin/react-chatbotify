import { BotStatesContextType } from '../../../src/context/BotStatesContext'; // Adjust the path to the correct location

// Mock implementation of the `useBotStatesContext` function
export const useBotStatesContext = jest.fn<BotStatesContextType, []>(() => ({
	isBotTyping: false,
	setSyncedIsBotTyping: jest.fn(),
	syncedIsBotTypingRef: {current: false},

	isChatWindowOpen: false,
	setSyncedIsChatWindowOpen: jest.fn(),
	syncedIsChatWindowOpenRef: {current: false},

	audioToggledOn: false,
	setSyncedAudioToggledOn: jest.fn(),
	syncedAudioToggledOnRef: {current: false},

	voiceToggledOn: false,
	setSyncedVoiceToggledOn: jest.fn(),
	syncedVoiceToggledOnRef: {current: false},

	notificationsToggledOn: true,
	setSyncedNotificationsToggledOn: jest.fn(),
	syncedNotificationsToggledOnRef: {current: false},

	isLoadingChatHistory: false,
	setIsLoadingChatHistory: jest.fn(),

	hasChatHistoryLoaded: false,
	setHasChatHistoryLoaded: jest.fn(),

	isScrolling: false,
	setSyncedIsScrolling: jest.fn(),
	syncedIsScrollingRef: {current: false},

	textAreaDisabled: true,
	setSyncedTextAreaDisabled: jest.fn(),
	syncedTextAreaDisabledRef: {current: false},

	textAreaSensitiveMode: false,
	setSyncedTextAreaSensitiveMode: jest.fn(),
	syncedTextAreaSensitiveModeRef: {current: false},


	hasInteractedPage: false,
	setHasInteractedPage: jest.fn(),

	hasFlowStarted: false,
	setHasFlowStarted: jest.fn(),

	unreadCount: 0,
	setUnreadCount: jest.fn(),

	inputLength: 0,
	setInputLength: jest.fn(),

	blockAllowsAttachment: false,
	setBlockAllowsAttachment: jest.fn(),

	viewportHeight: window.innerHeight,
	setViewportHeight: jest.fn(),

	viewportWidth: window.innerWidth,
	setViewportWidth: jest.fn(),
}));
