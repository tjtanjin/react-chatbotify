import { EventHandler } from "react";
import { RcbPreMessageInjectEvent } from "../src/types/events/RcbPreMessageInjectEvent";
import { RcbPostMessageInjectEvent } from "../src/types/events/RcbPostMessageInjectEvent";
import { RcbChatHistoryLoadEvent } from "../src/types/events/RcbChatHistoryLoadEvent";
import { RcbChatWindowToggleEvent } from "../src/types/events/RcbChatWindowToggleEvent";
import { RcbAudioToggleEvent } from "../src/types/events/RcbAudioToggleEvent";
import { RcbVoiceToggleEvent } from "../src/types/events/RcbVoiceToggleEvent";
import { RcbNotificationToggleEvent } from "../src/types/events/RcbNotificationToggle";
import { RcbStartMessageStreamEvent } from "../src/types/events/RcbStartMessageStreamEvent";
import { RcbChunkMessageStreamEvent } from "../src/types/events/RcbChunkMessageStreamEvent";
import { RcbStopMessageStreamEvent } from "../src/types/events/RcbStopMessageStreamEvent";
import { RcbPathChangeEvent } from "../src/types/events/RcbPathChangeEvent";
import { RcbShowToastEvent } from "../src/types/events/RcbShowToastEvent";
import { RcbDismissToastEvent } from "../src/types/events/RcbDismissToastEvent";
import { RcbUserSubmitInputEvent } from "../src/types/events/RcbUserSubmitInputEvent";

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
        "rcb-pre-message-inject": RcbPreMessageInjectEvent;
        "rcb-post-message-inject": RcbPostMessageInjectEvent;
		"rcb-start-message-stream": RcbStartMessageStreamEvent;
		"rcb-chunk-message-stream": RcbChunkMessageStreamEvent;
		"rcb-stop-message-stream": RcbStopMessageStreamEvent;
        "rcb-chat-history-load": RcbChatHistoryLoadEvent;
        "rcb-chat-window-toggle": RcbChatWindowToggleEvent;
        "rcb-audio-toggle": RcbAudioToggleEvent;
		"rcb-notification-toggle": RcbNotificationToggleEvent;
        "rcb-voice-toggle": RcbVoiceToggleEvent;
		"rcb-path-change": RcbPathChangeEvent;
		"rcb-show-toast": RcbShowToastEvent;
		"rcb-dismiss-toast": RcbDismissToastEvent;
		"rcb-user-submit-input": RcbUserSubmitInputEvent;
    }
}
