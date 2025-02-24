import { DefaultSettings } from "../../src/constants/internal/DefaultSettings";

export const MockDefaultSettings = {
	...DefaultSettings,
	// enable all events for testing
	event: {
		rcbPreInjectMessage: true,
		rcbPostInjectMessage: true,
		rcbPreLoadChatBot: true,
		rcbPostLoadChatBot: true,
		rcbStartStreamMessage: true,
		rcbChunkStreamMessage: true,
		rcbStopStreamMessage: true,
		rcbRemoveMessage: true,
		rcbLoadChatHistory: true,
		rcbToggleChatWindow: true,
		rcbStartSpeakAudio: true,
		rcbToggleAudio: true,
		rcbToggleNotifications: true,
		rcbToggleVoice: true,
		rcbChangePath: true,
		rcbShowToast: true,
		rcbDismissToast: true,
		rcbUserSubmitText: true,
		rcbUserUploadFile: true,
		rcbTextAreaChangeValue: true,
	}
}