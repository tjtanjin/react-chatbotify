import { EventHandler } from "react";
import { RcbPreInjectMessageEvent } from "../src/types/events/RcbPreInjectMessageEvent";
import { RcbPostInjectMessageEvent } from "../src/types/events/RcbPostInjectMessageEvent";
import { RcbLoadChatHistoryEvent } from "../src/types/events/RcbLoadChatHistoryEvent";
import { RcbToggleChatWindowEvent } from "../src/types/events/RcbToggleChatWindowEvent";
import { RcbToggleAudioEvent } from "../src/types/events/RcbToggleAudioEvent";
import { RcbToggleVoiceEvent } from "../src/types/events/RcbToggleVoiceEvent";
import { RcbToggleNotificationsEvent } from "../src/types/events/RcbToggleNotificationsEvent";
import { RcbStartStreamMessageEvent } from "../src/types/events/RcbStartStreamMessageEvent";
import { RcbChunkStreamMessageEvent } from "../src/types/events/RcbChunkStreamMessageEvent";
import { RcbStopStreamMessageEvent } from "../src/types/events/RcbStopStreamMessageEvent";
import { RcbChangePathEvent } from "../src/types/events/RcbChangePathEvent";
import { RcbShowToastEvent } from "../src/types/events/RcbShowToastEvent";
import { RcbDismissToastEvent } from "../src/types/events/RcbDismissToastEvent";
import { RcbUserSubmitTextEvent } from "../src/types/events/RcbUserSubmitTextEvent";
import { RcbUserUploadFileEvent } from "../src/types/events/RcbUserUploadFileEvent";
import { RcbEvent } from "../src/constants/RcbEvent";

declare global {
	interface Navigator {
		virtualKeyboard?: VirtualKeyboard;
	}

	/**
	 * Represents the virtual keyboard API, which extends the browser's navigator object.
	 * 
	 * Note: VirtualKeyboard is not natively supported by TypeScript. The implementation 
	 * provided here is based on the proposed specification available at 
	 * {@link https://w3c.github.io/virtual-keyboard/#dom-navigator-virtualkeyboard}.
	 */
	interface VirtualKeyboard extends EventTarget {
		hide(): void
		show(): void;
		boundingRect: DOMRect;
		overlaysContent: boolean;
		ongeometrychange: EventHandler;
	}

	// for custom rcb events
	interface WindowEventMap {
		// audio
		[RcbEvent.TOGGLE_AUDIO]: RcbToggleAudioEvent;

		// notifications:
		[RcbEvent.TOGGLE_NOTIFICATIONS]: RcbToggleNotificationsEvent;

		// voice
		[RcbEvent.TOGGLE_VOICE]: RcbToggleVoiceEvent;

		// chat window
        [RcbEvent.TOGGLE_CHAT_WINDOW]: RcbToggleChatWindowEvent;

		// messages
        [RcbEvent.PRE_INJECT_MESSAGE]: RcbPreInjectMessageEvent;
        [RcbEvent.POST_INJECT_MESSAGE]: RcbPostInjectMessageEvent;
		[RcbEvent.START_STREAM_MESSAGE]: RcbStartStreamMessageEvent;
		[RcbEvent.CHUNK_STREAM_MESSAGE]: RcbChunkStreamMessageEvent;
		[RcbEvent.STOP_STREAM_MESSAGE]: RcbStopStreamMessageEvent;

		// chat history
        [RcbEvent.LOAD_CHAT_HISTORY]: RcbLoadChatHistoryEvent;

		// path
		[RcbEvent.CHANGE_PATH]: RcbChangePathEvent;

		// toast
		[RcbEvent.SHOW_TOAST]: RcbShowToastEvent;
		[RcbEvent.DISMISS_TOAST]: RcbDismissToastEvent;

		// user input submission
		[RcbEvent.USER_SUBMIT_TEXT]: RcbUserSubmitTextEvent;
		[RcbEvent.USER_UPLOAD_FILE]: RcbUserUploadFileEvent;
    }
}
