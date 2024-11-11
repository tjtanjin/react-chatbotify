// chatbot import
import ChatBot from "./components/ChatBot";

// provider import
import ChatBotProvider from "./context/ChatBotContext";

// util imports
import { getDefaultSettings } from "./utils/configParser";
import { getDefaultStyles } from "./utils/configParser";

// type imports
import { Block } from "./types/Block";
import { Params } from "./types/Params";
import { Flow } from "./types/Flow";
import { Message } from "./types/Message";
import { Plugin } from "./types/Plugin";
import { Settings } from "./types/Settings";
import { Styles } from "./types/Styles";
import { Toast } from "./types/Toast";
import { Theme } from "./types/Theme";
import { Button } from "./constants/Button";

// event imports
import { RcbLoadChatHistoryEvent } from "./types/events/RcbLoadChatHistoryEvent";
import { RcbToggleChatWindowEvent } from "./types/events/RcbToggleChatWindowEvent";
import { RcbToggleAudioEvent } from "./types/events/RcbToggleAudioEvent";
import { RcbPreInjectMessageEvent } from "./types/events/RcbPreInjectMessageEvent";
import { RcbPreLoadChatBotEvent } from "./types/events/RcbPreLoadChatBotEvent";
import { RcbPostLoadChatBotEvent } from "./types/events/RcbPostLoadChatBotEvent";
import { RcbToggleNotificationsEvent } from "./types/events/RcbToggleNotificationsEvent";
import { RcbToggleVoiceEvent } from "./types/events/RcbToggleVoiceEvent";
import { RcbStartStreamMessageEvent } from "./types/events/RcbStartStreamMessageEvent";
import { RcbPostInjectMessageEvent } from "./types/events/RcbPostInjectMessageEvent";
import { RcbChunkStreamMessageEvent } from "./types/events/RcbChunkStreamMessageEvent";
import { RcbStopStreamMessageEvent } from "./types/events/RcbStopStreamMessageEvent";
import { RcbRemoveMessageEvent } from "./types/events/RcbRemoveMessageEvent";
import { RcbChangePathEvent } from "./types/events/RcbChangePathEvent";
import { RcbShowToastEvent } from "./types/events/RcbShowToastEvent";
import { RcbDismissToastEvent } from "./types/events/RcbDismissToastEvent";
import { RcbUserSubmitTextEvent } from "./types/events/RcbUserSubmitTextEvent";
import { RcbUserUploadFileEvent } from "./types/events/RcbUserUploadFileEvent";
import { RcbTextAreaChangeValueEvent } from "./types/events/RcbTextAreaChangeValue";

// hook imports
import { useAudio } from "./hooks/useAudio";
import { useBotId } from "./hooks/useBotId";
import { useChatWindow } from "./hooks/useChatWindow";
import { useFirstInteraction } from "./hooks/useFirstInteraction";
import { useFlow } from "./hooks/useFlow";
import { useMessages } from "./hooks/useMessages";
import { useNotifications } from "./hooks/useNotifications";
import { usePaths } from "./hooks/usePaths";
import { useSettings } from "./hooks/useSettings";
import { useStyles } from "./hooks/useStyles";
import { useTextArea } from "./hooks/useTextArea";
import { useToasts } from "./hooks/useToasts";
import { useVoice } from "./hooks/useVoice";
import { useChatHistory } from "./hooks/useChatHistory";

// util exports
export {
	getDefaultSettings,
	getDefaultStyles
};

// type exports
export type {
	Block,
	Params,
	Flow,
	Message,
	Plugin,
	Settings,
	Styles,
	Toast,
	Theme
};

// event exports
export type {
	RcbPreInjectMessageEvent,
	RcbPostInjectMessageEvent,
	RcbPreLoadChatBotEvent,
	RcbPostLoadChatBotEvent,
	RcbStartStreamMessageEvent,
	RcbChunkStreamMessageEvent,
	RcbStopStreamMessageEvent,
	RcbRemoveMessageEvent,
	RcbLoadChatHistoryEvent,
	RcbToggleChatWindowEvent,
	RcbToggleAudioEvent,
	RcbToggleNotificationsEvent,
	RcbToggleVoiceEvent,
	RcbChangePathEvent,
	RcbShowToastEvent,
	RcbDismissToastEvent,
	RcbUserSubmitTextEvent,
	RcbUserUploadFileEvent,
	RcbTextAreaChangeValueEvent,
}

// constant exports
export {
	Button
};

// hook exports
export {
	useAudio,
	useBotId,
	useChatWindow,
	useFirstInteraction,
	useFlow,
	useMessages,
	useNotifications,
	usePaths,
	useSettings,
	useStyles,
	useTextArea,
	useToasts,
	useVoice,
	useChatHistory
}

// provider export
export {
	ChatBotProvider
}

// chatbot export
export default ChatBot