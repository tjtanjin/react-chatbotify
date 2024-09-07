import ChatBot from "./components/ChatBot";
import { getDefaultSettings } from "./utils/configParser";
import { getDefaultStyles } from "./utils/configParser";
import { SettingsContext } from "./context/SettingsContext";
import { StylesContext } from "./context/StylesContext";
import { MessagesContext } from "./context/MessagesContext";
import { PathsContext } from "./context/PathsContext";
import { Block } from "./types/Block";
import { Params } from "./types/Params";
import { Flow } from "./types/Flow";
import { Message } from "./types/Message";
import { Settings } from "./types/Settings";
import { Styles } from "./types/Styles";
import { Theme } from "./types/Theme";
import { Button } from "./constants/Button";

// event imports
import { RcbChatHistoryLoadEvent } from "./types/events/RcbChatHistoryLoadEvent";
import { RcbChatWindowToggleEvent } from "./types/events/RcbChatWindowToggleEvent";
import { RcbAudioToggleEvent } from "./types/events/RcbAudioToggleEvent";
import { RcbPreMessageInjectEvent } from "./types/events/RcbPreMessageInjectEvent";
import { RcbNotificationToggleEvent } from "./types/events/RcbNotificationToggle";
import { RcbVoiceToggleEvent } from "./types/events/RcbVoiceToggleEvent";
import { RcbStartMessageStreamEvent } from "./types/events/RcbStartMessageStreamEvent";
import { RcbPostMessageInjectEvent } from "./types/events/RcbPostMessageInjectEvent";
import { RcbChunkMessageStreamEvent } from "./types/events/RcbChunkMessageStreamEvent";
import { RcbStopMessageStreamEvent } from "./types/events/RcbStopMessageStreamEvent";
import { RcbPathChangeEvent } from "./types/events/RcbPathChangeEvent";
import { RcbShowToastEvent } from "./types/events/RcbShowToastEvent";
import { RcbDismissToastEvent } from "./types/events/RcbDismissToastEvent";
import { RcbUserSubmitInputEvent } from "./types/events/RcbUserSubmitInputEvent";

// util exports
export {
	getDefaultSettings,
	getDefaultStyles
};

// context exports
export {
	SettingsContext,
	StylesContext,
	MessagesContext,
	PathsContext
};

// type exports
export type {
	Block,
	Params,
	Flow,
	Message,
	Settings,
	Styles,
	Theme
};

// event exports
export type {
	RcbPreMessageInjectEvent,
	RcbPostMessageInjectEvent,
	RcbStartMessageStreamEvent,
	RcbChunkMessageStreamEvent,
	RcbStopMessageStreamEvent,
	RcbChatHistoryLoadEvent,
	RcbChatWindowToggleEvent,
	RcbAudioToggleEvent,
	RcbNotificationToggleEvent,
	RcbVoiceToggleEvent,
	RcbPathChangeEvent,
	RcbShowToastEvent,
	RcbDismissToastEvent,
	RcbUserSubmitInputEvent
}

// constant exports
export { Button };

// chatbot export
export default ChatBot;