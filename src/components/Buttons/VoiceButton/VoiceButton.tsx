import { useEffect, MouseEvent, useState, useRef } from "react";

import MediaDisplay from "../../ChatBotBody/MediaDisplay/MediaDisplay";
import { startVoiceRecording, stopVoiceRecording } from "../../../services/VoiceService";
import { getMediaFileDetails } from "../../../utils/mediaFileParser";
import { useTextAreaInternal } from "../../../hooks/internal/useTextAreaInternal";
import { useVoiceInternal } from "../../../hooks/internal/useVoiceInternal";
import { useMessagesInternal } from "../../../hooks/internal/useMessagesInternal";
import { useSubmitInputInternal } from "../../../hooks/internal/useSubmitInputInternal";
import { useBotRefsContext } from "../../../context/BotRefsContext";
import { useSettingsContext } from "../../../context/SettingsContext";
import { useStylesContext } from "../../../context/StylesContext";

import "./VoiceButton.css";

/**
 * Toggles voice to text input to the chat bot.
 */
const VoiceButton = () => {

	// handles settings
	const { settings } = useSettingsContext();

	// handles styles
	const { styles } = useStylesContext();

	// handles messages
	const { injectMessage } = useMessagesInternal();

	// handles bot refs
	const { inputRef } = useBotRefsContext();

	// handles voice
	const { voiceToggledOn, toggleVoice } = useVoiceInternal();

	// handles input text area
	const { setInputLength, textAreaDisabled } = useTextAreaInternal();

	// handles user input submission
	const { handleSubmitText } = useSubmitInputInternal();

	// tracks audio chunk (if voice is sent as audio)
	const audioChunksRef = useRef<BlobPart[]>([]);

	// serves as a workaround (together with useEffect hook) for sending voice input, can consider a better approach
	const [voiceInputTrigger, setVoiceInputTrigger] = useState<boolean>(false);
	useEffect(() => {
		if (settings.voice?.sendAsAudio) {
			handleSendAsAudio();
			audioChunksRef.current = [];
		} else {
			handleSubmitText();
		}
	}, [voiceInputTrigger])
	
	// handles starting and stopping of voice recording on toggle
	useEffect(() => {
		if (voiceToggledOn) {
			startVoiceRecording(settings, toggleVoice, triggerSendVoiceInput,
				setInputLength, audioChunksRef, inputRef);
		} else {
			stopVoiceRecording();
		}
	}, [voiceToggledOn]);

	// styles for voice icon
	const voiceIconStyle: React.CSSProperties = {
		backgroundImage: `url(${settings.voice?.icon})`,
		...styles.voiceIconStyle
	};

	// styles for voice disabled icon
	const voiceIconDisabledStyle: React.CSSProperties = {
		backgroundImage: `url(${settings.voice?.icon})`,
		...styles.voiceIconDisabledStyle
	};

	/**
	 * Handles submission of user voice input.
	 */
	const triggerSendVoiceInput = () => {
		setVoiceInputTrigger(prev => !prev);
	}

	/*
	 * Handles sending of voice input as audio file if enabled.
	 */
	const handleSendAsAudio = async () => {
		const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
		const audioFile = new File([audioBlob], "voice-input.wav", { type: "audio/wav" });
		const fileDetails = await getMediaFileDetails(audioFile);
		if (!fileDetails.fileType || !fileDetails.fileUrl) {
			return;
		}

		// sends media display if file details are valid
		await injectMessage(<MediaDisplay file={audioFile} fileType={fileDetails.fileType}
			fileUrl={fileDetails.fileUrl}/>, "user");
	}

	return (
		<div
			onMouseDown={(event: MouseEvent) => {
				event.preventDefault();
				if (inputRef.current?.disabled) {
					return;
				}
				toggleVoice();
			}}
			style={voiceToggledOn && !textAreaDisabled ? styles.voiceButtonStyle : styles.voiceButtonDisabledStyle}
			className={voiceToggledOn && !textAreaDisabled ? "rcb-voice-button-enabled" : "rcb-voice-button-disabled"}
		>
			<span
				className={voiceToggledOn && !textAreaDisabled ? "rcb-voice-icon-on" : "rcb-voice-icon-off"}
				style={voiceToggledOn && !textAreaDisabled ? voiceIconStyle : voiceIconDisabledStyle}
			/>
		</div>
	);
};

export default VoiceButton;
