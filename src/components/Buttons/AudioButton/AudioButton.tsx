import { Dispatch, MouseEvent, SetStateAction } from "react";

import { useSettings } from "../../../context/SettingsContext";
import { useStyles } from "../../../context/StylesContext";

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

	// handles styles for bot
	const { styles } = useStyles();

	// styles for audio icon
	const audioIconStyle: React.CSSProperties = {
		backgroundImage: `url(${settings.audio?.icon})`,
		...styles.audioIconStyle
	};

	// styles for audio disabled icon
	const audioIconDisabledStyle: React.CSSProperties = {
		backgroundImage: `url(${settings.audio?.icon})`,
		...styles.audioIconDisabledStyle
	};

	return (
		<div
			onMouseDown={(event: MouseEvent) => {
				event.preventDefault();
				setAudioToggledOn(prev => !prev);
			}}
			style={audioToggledOn ? styles.audioButtonStyle : styles.audioButtonDisabledStyle}
		>
			<span
				className={`rcb-audio-icon-${audioToggledOn ? "on" : "off"}`}
				style={audioToggledOn ? audioIconStyle : audioIconDisabledStyle}
			/>
		</div>
	);
};

export default AudioButton;
