import { Dispatch, MouseEvent, SetStateAction } from "react";

import { useSettings } from "../../../context/SettingsContext";

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
	const { settings } = useSettings();

	return (
		<div
			style={{backgroundImage: `url(${settings.audio?.icon})`}}
			onMouseDown={(event: MouseEvent) => {
				event.preventDefault();
				setAudioToggledOn(prev => !prev);
			}}
			className={`rcb-audio-icon-${audioToggledOn ? "on" : "off"}`}
		></div>
	);
};

export default AudioButton;
