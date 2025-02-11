import { BotStatesContextType } from '../../../src/context/BotStatesContext'; // Adjust the path to the correct location

// Mock implementation of the `useBotStatesContext` function
export const useBotStatesContext = jest.fn<BotStatesContextType, []>(() => ({
	isBotTyping: false,
	setIsBotTyping: jest.fn(),

	isChatWindowOpen: false,
	setIsChatWindowOpen: jest.fn(),

	audioToggledOn: false,
	setAudioToggledOn: jest.fn(),

	voiceToggledOn: false,
	setVoiceToggledOn: jest.fn(),

	notificationsToggledOn: true,
	setNotificationsToggledOn: jest.fn(),

	isLoadingChatHistory: false,
	setIsLoadingChatHistory: jest.fn(),

	isScrolling: false,
	setIsScrolling: jest.fn(),

	textAreaDisabled: true,
	setTextAreaDisabled: jest.fn(),

	textAreaSensitiveMode: false,
	setTextAreaSensitiveMode: jest.fn(),

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

	timeoutId: null,
	setTimeoutId: jest.fn(),

	viewportHeight: window.innerHeight,
	setViewportHeight: jest.fn(),

	viewportWidth: window.innerWidth,
	setViewportWidth: jest.fn(),
}));
