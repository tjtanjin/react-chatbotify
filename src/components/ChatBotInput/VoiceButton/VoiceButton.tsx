import { RefObject, useEffect, MouseEvent } from "react";

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
 */
const VoiceButton = ({
	inputRef,
	textAreaDisabled,
	voiceToggledOn,
	handleToggleVoice,
	triggerSendVoiceInput
}: {
	inputRef: RefObject<HTMLTextAreaElement>;
	textAreaDisabled: boolean;
	voiceToggledOn: boolean;
	handleToggleVoice: () => void;
	triggerSendVoiceInput: () => void;
}) => {

	// handles options for bot
	const { botOptions } = useBotOptions();

	// handles starting and stopping of voice recording on toggle
	useEffect(() => {
		if (voiceToggledOn) {
			startVoiceRecording(botOptions, handleToggleVoice, triggerSendVoiceInput, inputRef);
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