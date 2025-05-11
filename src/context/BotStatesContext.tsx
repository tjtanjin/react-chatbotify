import { useContext, createContext, Dispatch, SetStateAction, useState, MutableRefObject } from "react";

import { useSyncedRefState } from "../hooks/internal/useSyncedRefState";
import { Settings } from "../types/Settings";

/**
 * Creates the useBotStatesContext() hook to manage common states.
 */
export type BotStatesContextType = {
	isBotTyping: boolean;
	setSyncedIsBotTyping: Dispatch<SetStateAction<boolean>>;
	syncedIsBotTypingRef: MutableRefObject<boolean>;
	
	isChatWindowOpen: boolean;
	setSyncedIsChatWindowOpen: Dispatch<SetStateAction<boolean>>;
	syncedIsChatWindowOpenRef: MutableRefObject<boolean>;

	audioToggledOn: boolean;
	setSyncedAudioToggledOn: Dispatch<SetStateAction<boolean>>;
	syncedAudioToggledOnRef: MutableRefObject<boolean>;

	voiceToggledOn: boolean;
	setVoiceToggledOn: Dispatch<SetStateAction<boolean>>;

	notificationsToggledOn: boolean;
	setNotificationsToggledOn: Dispatch<SetStateAction<boolean>>;

	isLoadingChatHistory: boolean;
	setIsLoadingChatHistory: Dispatch<SetStateAction<boolean>>;

	hasChatHistoryLoaded: boolean;
	setHasChatHistoryLoaded: Dispatch<SetStateAction<boolean>>;

	isScrolling: boolean;
	setSyncedIsScrolling: Dispatch<SetStateAction<boolean>>;
	syncedIsScrollingRef: MutableRefObject<boolean>;

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
	const [isBotTyping, setSyncedIsBotTyping, syncedIsBotTypingRef] = useSyncedRefState<boolean>(false);
	const [isChatWindowOpen, setSyncedIsChatWindowOpen, syncedIsChatWindowOpenRef] = useSyncedRefState<boolean>(
		settings?.chatWindow?.defaultOpen ?? false
	);
	const [audioToggledOn, setSyncedAudioToggledOn, syncedAudioToggledOnRef] = useSyncedRefState<boolean>(
		settings?.audio?.defaultToggledOn ?? false
	);
	const [voiceToggledOn, setVoiceToggledOn] = useState<boolean>(settings?.voice?.defaultToggledOn ?? false);
	const [notificationsToggledOn, setNotificationsToggledOn] = useState<boolean>(
		settings?.notification?.defaultToggledOn ?? true
	);
	const [isLoadingChatHistory, setIsLoadingChatHistory] = useState<boolean>(false);
	const [hasChatHistoryLoaded, setHasChatHistoryLoaded] = useState<boolean>(false);
	const [isScrolling, setSyncedIsScrolling, syncedIsScrollingRef] = useSyncedRefState<boolean>(false);
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
			setSyncedIsBotTyping,
			syncedIsBotTypingRef,
			isChatWindowOpen,
			setSyncedIsChatWindowOpen,
			syncedIsChatWindowOpenRef,
			audioToggledOn,
			setSyncedAudioToggledOn,
			syncedAudioToggledOnRef,
			voiceToggledOn,
			setVoiceToggledOn,
			notificationsToggledOn,
			setNotificationsToggledOn,
			isLoadingChatHistory,
			setIsLoadingChatHistory,
			hasChatHistoryLoaded,
			setHasChatHistoryLoaded,
			isScrolling,
			setSyncedIsScrolling,
			syncedIsScrollingRef,
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
