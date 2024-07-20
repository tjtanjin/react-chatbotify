import { Dispatch, MouseEvent, SetStateAction } from "react";

import { useBotSettings } from "../../../context/BotSettingsContext";

import "./AudioButton.css";

/**
 * Handles toggling of the audio feature.
 * 
 * @param audioToggledOn boolean indicating whether audio is turned on
 * @param setAudioToggledOn sets the state of the audio feature
 */
const AudioButton = ({
	audioToggledOn,
	setAudioToggledOn
}: {
	audioToggledOn: boolean;
	setAudioToggledOn: Dispatch<SetStateAction<boolean>>;
}) => {
	// handles options for bot
	const { botSettings } = useBotSettings();

	return (
		<div
			style={{backgroundImage: `url(${botSettings.audio?.icon})`}}
			onMouseDown={(event: MouseEvent) => {
				event.preventDefault();
				setAudioToggledOn(prev => !prev);
			}}
			className={`rcb-audio-icon-${audioToggledOn ? "on" : "off"}`}
		></div>
	);
};

export default AudioButton;
