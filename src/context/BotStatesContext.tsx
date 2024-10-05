import { useContext, createContext, Dispatch, SetStateAction, useState } from "react";

import { Settings } from "../types/Settings";

/**
 * Creates the useBotStatesContext() hook to manage common states.
 */
export type BotStatesContextType = {
	isBotTyping: boolean;
	setIsBotTyping: Dispatch<SetStateAction<boolean>>;
	
	isChatWindowOpen: boolean;
	setIsChatWindowOpen: Dispatch<SetStateAction<boolean>>;

	audioToggledOn: boolean;
	setAudioToggledOn: Dispatch<SetStateAction<boolean>>;

	voiceToggledOn: boolean;
	setVoiceToggledOn: Dispatch<SetStateAction<boolean>>;

	notificationsToggledOn: boolean;
	setNotificationsToggledOn: Dispatch<SetStateAction<boolean>>;

	isLoadingChatHistory: boolean;
	setIsLoadingChatHistory: Dispatch<SetStateAction<boolean>>;

	isScrolling: boolean;
	setIsScrolling: Dispatch<SetStateAction<boolean>>;

	textAreaDisabled: boolean;
	setTextAreaDisabled: Dispatch<SetStateAction<boolean>>;

	textAreaSensitiveMode: boolean;
	setTextAreaSensitiveMode: Dispatch<SetStateAction<boolean>>;

	hasInteractedPage: boolean;
	setHasInteractedPage: Dispatch<SetStateAction<boolean>>;

	hasFlowStarted: boolean;
	setHasFlowStarted: Dispatch<SetStateAction<boolean>>;

	unreadCount: number;
	setUnreadCount: Dispatch<SetStateAction<number>>;

	inputLength: number;
	setInputLength: Dispatch<SetStateAction<number>>;

	blockAllowsAttachment: boolean;
	setBlockAllowsAttachment: Dispatch<SetStateAction<boolean>>;

	timeoutId: ReturnType<typeof setTimeout> | null;
	setTimeoutId: Dispatch<SetStateAction<ReturnType<typeof setTimeout> | null>>;

	viewportHeight: number;
	setViewportHeight: Dispatch<SetStateAction<number>>;

	viewportWidth: number;
	setViewportWidth: Dispatch<SetStateAction<number>>;

};
const BotStatesContext = createContext<BotStatesContextType>({} as BotStatesContextType);
const useBotStatesContext = () => useContext(BotStatesContext);

/**
 * Creates provider to wrap the chatbot container.
 */
const BotStatesProvider = ({
	children,
	settings
}: {
	children: React.ReactNode;
	settings?: Settings;
}) => {
	const [isBotTyping, setIsBotTyping] = useState<boolean>(false);
	const [isChatWindowOpen, setIsChatWindowOpen] = useState<boolean>(settings?.chatWindow?.defaultOpen ?? false);
	const [audioToggledOn, setAudioToggledOn] = useState<boolean>(settings?.audio?.defaultToggledOn ?? false);
	const [voiceToggledOn, setVoiceToggledOn] = useState<boolean>(settings?.voice?.defaultToggledOn ?? false);
	const [notificationsToggledOn, setNotificationsToggledOn] = useState<boolean>(
		settings?.notification?.defaultToggledOn ?? true
	);
	const [isLoadingChatHistory, setIsLoadingChatHistory] = useState<boolean>(false);
	const [isScrolling, setIsScrolling] = useState<boolean>(false);
	const [textAreaDisabled, setTextAreaDisabled] = useState<boolean>(true);
	const [textAreaSensitiveMode, setTextAreaSensitiveMode] = useState<boolean>(false);
	const [hasInteractedPage, setHasInteractedPage] = useState<boolean>(false);
	const [hasFlowStarted, setHasFlowStarted] = useState<boolean>(false);
	const [unreadCount, setUnreadCount] = useState<number>(0);
	const [inputLength, setInputLength] = useState<number>(0);
	const [blockAllowsAttachment, setBlockAllowsAttachment] = useState<boolean>(false);
	// tracks block timeout if transition is interruptable
	const [timeoutId, setTimeoutId] = useState<ReturnType<typeof setTimeout> | null>(null);
	// tracks view port height and width (for auto-resizing on mobile view)
	const [viewportHeight, setViewportHeight] = useState<number>(window.visualViewport?.height as number
		?? window.innerHeight);
	const [viewportWidth, setViewportWidth] = useState<number>(window.visualViewport?.width as number
		?? window.innerWidth);

	return (
		<BotStatesContext.Provider value={{
			isBotTyping,
			setIsBotTyping,
			isChatWindowOpen,
			setIsChatWindowOpen,
			audioToggledOn,
			setAudioToggledOn,
			voiceToggledOn,
			setVoiceToggledOn,
			notificationsToggledOn,
			setNotificationsToggledOn,
			isLoadingChatHistory,
			setIsLoadingChatHistory,
			isScrolling,
			setIsScrolling,
			textAreaDisabled,
			setTextAreaDisabled,
			textAreaSensitiveMode,
			setTextAreaSensitiveMode,
			hasInteractedPage,
			setHasInteractedPage,
			hasFlowStarted,
			setHasFlowStarted,
			unreadCount,
			setUnreadCount,
			inputLength,
			setInputLength,
			blockAllowsAttachment,
			setBlockAllowsAttachment,
			timeoutId,
			setTimeoutId,
			viewportHeight,
			setViewportHeight,
			viewportWidth,
			setViewportWidth
		}}>
			{children}
		</BotStatesContext.Provider>
	);
};

export { useBotStatesContext, BotStatesProvider };
