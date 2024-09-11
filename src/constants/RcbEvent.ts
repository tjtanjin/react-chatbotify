// identifiers for rcb events provided by the chatbot
const RcbEvent = {
	// audio
	TOGGLE_AUDIO: "rcb-toggle-audio",

	// notifications:
	TOGGLE_NOTIFICATIONS: "rcb-toggle-notifications",

	// voice
	TOGGLE_VOICE: "rcb-voice-toggle",

	// chat window
	TOGGLE_CHAT_WINDOW: "rcb-toggle-chat-window",

	// messages:
	PRE_INJECT_MESSAGE: "rcb-pre-inject-message",
	POST_INJECT_MESSAGE: "rcb-post-inject-message",
	START_STREAM_MESSAGE: "rcb-start-stream-message",
	CHUNK_STREAM_MESSAGE: "rcb-chunk-stream-message",
	STOP_STREAM_MESSAGE: "rcb-stop-stream-message",
	REMOVE_MESSAGE: "rcb-remove-message",

	// chat history
	LOAD_CHAT_HISTORY: "rcb-load-chat-history",

	// path
	CHANGE_PATH: "rcb-change-path",

	// toast
	SHOW_TOAST: "rcb-show-toast",
	DISMISS_TOAST: "rcb-dismiss-toast",
	
	// user input submission
	USER_SUBMIT_TEXT: "rcb-user-submit-text",
	USER_UPLOAD_FILE: "rcb-user-upload-file",
}

export { RcbEvent };
