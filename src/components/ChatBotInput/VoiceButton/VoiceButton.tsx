import { RefObject, Dispatch, SetStateAction, useEffect, MouseEvent } from "react";

import { startVoiceRecording, stopVoiceRecording } from "../../../services/VoiceService";
import { useBotOptions } from "../../../context/BotOptionsContext";

import "./VoiceButton.css";

/**
 * Toggles voice to text input to the chat bot.
 *
 * @param inputRef reference to the textarea
 * @param textAreaDisabled boolean indicating if textarea is disabled
 * @param voiceToggledOn boolean indicating if voice is toggled on
 * @param handleToggleVoice handles toggling of voice
 * @param triggerSendVoiceInput triggers sending of voice input into chat window
 * @param setInputLength sets the input length to reflect character count & limit
 * @param setAudioChunks sets the audio chunk if voice input is sent as audio file
 */
const VoiceButton = ({
	inputRef,
	textAreaDisabled,
	voiceToggledOn,
	handleToggleVoice,
	triggerSendVoiceInput,
	setInputLength,
	setAudioChunks
}: {
	inputRef: RefObject<HTMLTextAreaElement | HTMLInputElement>;
	textAreaDisabled: boolean;
	voiceToggledOn: boolean;
	handleToggleVoice: () => void;
	triggerSendVoiceInput: () => void;
	setInputLength: Dispatch<SetStateAction<number>>;
	setAudioChunks: Dispatch<SetStateAction<BlobPart[]>>;
}) => {

	// handles options for bot
	const { botOptions } = useBotOptions();
	
	// handles starting and stopping of voice recording on toggle
	useEffect(() => {
		if (voiceToggledOn) {
			startVoiceRecording(botOptions, handleToggleVoice, triggerSendVoiceInput,
				setInputLength, setAudioChunks, inputRef);
		} else {
			stopVoiceRecording();
		}
	}, [voiceToggledOn]);

	return (
		<div
			onMouseDown={(event: MouseEvent) => {
				event.preventDefault();
				handleToggleVoice();
			}}
			className={voiceToggledOn && !textAreaDisabled ? "rcb-voice-button-enabled" : "rcb-voice-button-disabled"}
		>
			<span className={voiceToggledOn && !textAreaDisabled ? "rcb-voice-icon-on" : "rcb-voice-icon-off"}
				style={{backgroundImage: `url(${botOptions.voice?.icon})`}}
			/>
		</div>
	);
};

export default VoiceButton;