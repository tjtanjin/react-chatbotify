import ChatBot from "./components/ChatBot";
import ChatBotProvider from "./context/ChatBotProvider";

import { getDefaultSettings } from "./utils/configParser";
import { getDefaultStyles } from "./utils/configParser";
import { Block } from "./types/Block";
import { Params } from "./types/Params";
import { Flow } from "./types/Flow";
import { Message } from "./types/Message";
import { Settings } from "./types/Settings";
import { Styles } from "./types/Styles";
import { Toast } from "./types/Toast";
import { Theme } from "./types/Theme";
import { Button } from "./constants/Button";
import { RcbEvent } from "./constants/RcbEvent";

// event imports
import { RcbLoadChatHistoryEvent } from "./types/events/RcbLoadChatHistoryEvent";
import { RcbToggleChatWindowEvent } from "./types/events/RcbToggleChatWindowEvent";
import { RcbToggleAudioEvent } from "./types/events/RcbToggleAudioEvent";
import { RcbPreInjectMessageEvent } from "./types/events/RcbPreInjectMessageEvent";
import { RcbToggleNotificationsEvent } from "./types/events/RcbToggleNotificationsEvent";
import { RcbToggleVoiceEvent } from "./types/events/RcbToggleVoiceEvent";
import { RcbStartStreamMessageEvent } from "./types/events/RcbStartStreamMessageEvent";
import { RcbPostInjectMessageEvent } from "./types/events/RcbPostInjectMessageEvent";
import { RcbChunkStreamMessageEvent } from "./types/events/RcbChunkStreamMessageEvent";
import { RcbStopStreamMessageEvent } from "./types/events/RcbStopStreamMessageEvent";
import { RcbChangePathEvent } from "./types/events/RcbChangePathEvent";
import { RcbShowToastEvent } from "./types/events/RcbShowToastEvent";
import { RcbDismissToastEvent } from "./types/events/RcbDismissToastEvent";
import { RcbUserSubmitTextEvent } from "./types/events/RcbUserSubmitTextEvent";
import { RcbUserUploadFileEvent } from "./types/events/RcbUserUploadFileEvent";

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
	Settings,
	Styles,
	Toast,
	Theme
};

// event exports
export type {
	RcbPreInjectMessageEvent,
	RcbPostInjectMessageEvent,
	RcbStartStreamMessageEvent,
	RcbChunkStreamMessageEvent,
	RcbStopStreamMessageEvent,
	RcbLoadChatHistoryEvent,
	RcbToggleChatWindowEvent,
	RcbToggleAudioEvent,
	RcbToggleNotificationsEvent,
	RcbToggleVoiceEvent,
	RcbChangePathEvent,
	RcbShowToastEvent,
	RcbDismissToastEvent,
	RcbUserSubmitTextEvent,
	RcbUserUploadFileEvent
}

// constant exports
export { Button, RcbEvent };

// chatbot export
export default { ChatBot, ChatBotProvider };