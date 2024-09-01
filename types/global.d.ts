import { EventHandler } from "react";
import { RcbPreMessageInjectEvent } from "../src/types/rcbEvents/RcbPreMessageInjectEvent";
import { RcbPostMessageInjectEvent } from "../src/types/rcbEvents/RcbPostMessageInjectEvent";
import { RcbChatHistoryLoadEvent } from "../src/types/rcbEvents/RcbChatHistoryLoadEvent";
import { RcbChatWindowToggleEvent } from "../src/types/rcbEvents/RcbChatWindowToggleEvent";
import { RcbAudioToggleEvent } from "../src/types/rcbEvents/RcbAudioToggleEvent";
import { RcbVoiceToggleEvent } from "../src/types/rcbEvents/RcbVoiceToggleEvent";
import { RcbNotificationToggleEvent } from "../src/types/rcbEvents/RcbNotificationToggle";
import { RcbStartMessageStreamEvent } from "../src/types/rcbEvents/RcbStartMessageStreamEvent";
import { RcbChunkMessageStreamEvent } from "../src/types/rcbEvents/RcbChunkMessageStreamEvent";
import { RcbStopMessageStreamEvent } from "../src/types/rcbEvents/RcbStopMessageStreamEvent";

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
    }
}
