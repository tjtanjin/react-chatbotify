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
	setSyncedVoiceToggledOn: Dispatch<SetStateAction<boolean>>;
	syncedVoiceToggledOnRef: MutableRefObject<boolean>;

	notificationsToggledOn: boolean;
	setSyncedNotificationsToggledOn: Dispatch<SetStateAction<boolean>>;
	syncedNotificationsToggledOnRef: MutableRefObject<boolean>;

	isLoadingChatHistory: boolean;
	setIsLoadingChatHistory: Dispatch<SetStateAction<boolean>>;

	hasChatHistoryLoaded: boolean;
	setHasChatHistoryLoaded: Dispatch<SetStateAction<boolean>>;

	isScrolling: boolean;
	setSyncedIsScrolling: Dispatch<SetStateAction<boolean>>;
	syncedIsScrollingRef: MutableRefObject<boolean>;

	textAreaDisabled: boolean;
	setSyncedTextAreaDisabled: Dispatch<SetStateAction<boolean>>;
	syncedTextAreaDisabledRef: MutableRefObject<boolean>;

	textAreaSensitiveMode: boolean;
	setSyncedTextAreaSensitiveMode: Dispatch<SetStateAction<boolean>>;
	syncedTextAreaSensitiveModeRef: MutableRefObject<boolean>;

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
	const [voiceToggledOn, setSyncedVoiceToggledOn, syncedVoiceToggledOnRef] = useSyncedRefState<boolean>(
		settings?.voice?.defaultToggledOn ?? false
	);
	const [
		notificationsToggledOn,
		setSyncedNotificationsToggledOn,
		syncedNotificationsToggledOnRef,
	] = useSyncedRefState<boolean>(
		settings?.notification?.defaultToggledOn ?? true
	);
	const [isLoadingChatHistory, setIsLoadingChatHistory] = useState<boolean>(false);
	const [hasChatHistoryLoaded, setHasChatHistoryLoaded] = useState<boolean>(false);
	const [isScrolling, setSyncedIsScrolling, syncedIsScrollingRef] = useSyncedRefState<boolean>(false);
	const [textAreaDisabled, setSyncedTextAreaDisabled, syncedTextAreaDisabledRef] = useSyncedRefState<boolean>(true);
	const [
		textAreaSensitiveMode,
		setSyncedTextAreaSensitiveMode,
		syncedTextAreaSensitiveModeRef
	] = useSyncedRefState<boolean>(false);
	const [hasInteractedPage, setHasInteractedPage] = useState<boolean>(false);
	const [hasFlowStarted, setHasFlowStarted] = useState<boolean>(false);
	const [unreadCount, setUnreadCount] = useState<number>(0);
	const [inputLength, setInputLength] = useState<number>(0);
	const [blockAllowsAttachment, setBlockAllowsAttachment] = useState<boolean>(false);
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
			setSyncedVoiceToggledOn,
			syncedVoiceToggledOnRef,
			notificationsToggledOn,
			setSyncedNotificationsToggledOn,
			syncedNotificationsToggledOnRef,
			isLoadingChatHistory,
			setIsLoadingChatHistory,
			hasChatHistoryLoaded,
			setHasChatHistoryLoaded,
			isScrolling,
			setSyncedIsScrolling,
			syncedIsScrollingRef,
			textAreaDisabled,
			setSyncedTextAreaDisabled,
			syncedTextAreaDisabledRef,
			textAreaSensitiveMode,
			setSyncedTextAreaSensitiveMode,
			syncedTextAreaSensitiveModeRef,
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
