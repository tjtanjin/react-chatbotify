import { RefObject, Dispatch, SetStateAction, useEffect, MouseEvent, useState } from "react";

import MediaDisplay from "../../ChatBotBody/MediaDisplay/MediaDisplay";
import { startVoiceRecording, stopVoiceRecording } from "../../../services/VoiceService";
import { getMediaFileDetails } from "../../../utils/mediaFileParser";
import { useSettings } from "../../../context/SettingsContext";
import { Flow } from "../../../types/Flow";

import "./VoiceButton.css";

/**
 * Toggles voice to text input to the chat bot.
 *
 * @param inputRef reference to the textarea
 * @param textAreaDisabled boolean indicating if textarea is disabled
 * @param voiceToggledOn boolean indicating if voice is toggled on
 * @param handleToggleVoice handles toggling of voice
 * @param getCurrPath retrieves current path for the user
 * @param handleActionInput handles action input from user 
 * @param injectMessage utility function for injecting a message into the messages array
 * @param setInputLength sets the input length to reflect character count & limit
 */
const VoiceButton = ({
	inputRef,
	textAreaDisabled,
	voiceToggledOn,
	handleToggleVoice,
	getCurrPath,
	handleActionInput,
	injectMessage,
	setInputLength,
}: {
	inputRef: RefObject<HTMLTextAreaElement | HTMLInputElement>;
	textAreaDisabled: boolean;
	voiceToggledOn: boolean;
	handleToggleVoice: () => void;
	getCurrPath: () => keyof Flow | null;
	handleActionInput: (path: keyof Flow, userInput: string, sendUserInput?: boolean) => Promise<void>;
	injectMessage: (content: string | JSX.Element, sender?: string) => Promise<void>;
	setInputLength: Dispatch<SetStateAction<number>>;
}) => {

	// handles options for bot
	const { settings } = useSettings();

	// tracks audio chunk (if voice is sent as audio)
	const [audioChunks, setAudioChunks] = useState<BlobPart[]>([]);

	// serves as a workaround (together with useEffect hook) for sending voice input, can consider a better approach
	const [voiceInputTrigger, setVoiceInputTrigger] = useState<boolean>(false);
	useEffect(() => {
		const currPath = getCurrPath();
		if (!currPath) {
			return;
		}

		if (settings.voice?.sendAsAudio) {
			handleSendAsAudio();
			setAudioChunks([]);
		} else {
			handleActionInput(currPath, inputRef.current?.value as string);
			setInputLength(0);
		}
	}, [voiceInputTrigger])
	
	// handles starting and stopping of voice recording on toggle
	useEffect(() => {
		if (voiceToggledOn) {
			startVoiceRecording(settings, handleToggleVoice, triggerSendVoiceInput,
				setInputLength, setAudioChunks, inputRef);
		} else {
			stopVoiceRecording();
		}
	}, [voiceToggledOn]);

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
		const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
		const audioFile = new File([audioBlob], 'voice-input.wav', { type: 'audio/wav' });
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
				handleToggleVoice();
			}}
			className={voiceToggledOn && !textAreaDisabled ? "rcb-voice-button-enabled" : "rcb-voice-button-disabled"}
		>
			<span className={voiceToggledOn && !textAreaDisabled ? "rcb-voice-icon-on" : "rcb-voice-icon-off"}
				style={{backgroundImage: `url(${settings.voice?.icon})`}}
			/>
		</div>
	);
};

export default VoiceButton;