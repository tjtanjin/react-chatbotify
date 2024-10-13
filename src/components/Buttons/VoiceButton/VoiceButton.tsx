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
	const { setInputLength, setTextAreaValue, textAreaDisabled } = useTextAreaInternal();

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
				setTextAreaValue, setInputLength, audioChunksRef, inputRef);
		} else {
			stopVoiceRecording();
		}
	}, [voiceToggledOn]);

	// styles for voice icon
	const voiceIconStyle: React.CSSProperties = {
		backgroundImage: `url(${settings.voice?.icon})`,
		fill: "#9aa0a6",
		...styles.voiceIconStyle
	};

	// styles for voice disabled icon
	const voiceIconDisabledStyle: React.CSSProperties = {
		backgroundImage: `url(${settings.voice?.iconDisabled})`,
		fill: "#9aa0a6",
		...styles.voiceIconStyle, // by default inherit the base style
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

	/**
	 * Renders button depending on whether an svg component or image url is provided.
	 */
	const renderButton = () => {
		const IconComponent = voiceToggledOn ? settings.voice?.icon : settings.voice?.iconDisabled;
		if (!IconComponent || typeof IconComponent === "string") {
			return (
				<span
					className={`rcb-voice-icon${voiceToggledOn && !textAreaDisabled ? "-on" : ""}`}
					style={voiceToggledOn && !textAreaDisabled ? voiceIconStyle : voiceIconDisabledStyle}
				/>
			)
		}
		return (
			IconComponent &&
			<span className={`rcb-voice-icon ${voiceToggledOn && !textAreaDisabled ? "on" : ""}`}>
				<IconComponent style={voiceToggledOn && !textAreaDisabled ? voiceIconStyle : voiceIconDisabledStyle}/>
			</span>
		)
	}

	return (
		<div
			aria-label={settings.ariaLabel?.voiceButton ?? "toggle voice"}
			role="button" 
			onMouseDown={(event: MouseEvent) => {
				event.preventDefault();
				if (textAreaDisabled) {
					return;
				}
				toggleVoice();
			}}
			style={voiceToggledOn && !textAreaDisabled
				? styles.voiceButtonStyle
				: {...styles.voiceButtonStyle, ...styles.voiceButtonDisabledStyle}
			}
			className={voiceToggledOn && !textAreaDisabled ? "rcb-voice-button-enabled" : "rcb-voice-button-disabled"}
		>
			{renderButton()}
		</div>
	);
};

export default VoiceButton;
