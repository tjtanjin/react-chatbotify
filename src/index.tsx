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
import { RcbChatHistoryLoadEvent } from "./types/rcbEvents/RcbChatHistoryLoadEvent";
import { RcbChatWindowToggleEvent } from "./types/rcbEvents/RcbChatWindowToggleEvent";
import { RcbAudioToggleEvent } from "./types/rcbEvents/RcbAudioToggleEvent";
import { RcbPreMessageInjectEvent } from "./types/rcbEvents/RcbPreMessageInjectEvent";
import { RcbNotificationToggleEvent } from "./types/rcbEvents/RcbNotificationToggle";
import { RcbVoiceToggleEvent } from "./types/rcbEvents/RcbVoiceToggleEvent";
import { RcbStartMessageStreamEvent } from "./types/rcbEvents/RcbStartMessageStreamEvent";
import { RcbPostMessageInjectEvent } from "./types/rcbEvents/RcbPostMessageInjectEvent";
import { RcbChunkMessageStreamEvent } from "./types/rcbEvents/RcbChunkMessageStreamEvent";
import { RcbStopMessageStreamEvent } from "./types/rcbEvents/RcbStopMessageStreamEvent";

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
	RcbVoiceToggleEvent
}

// constant exports
export { Button };

// chatbot export
export default ChatBot;