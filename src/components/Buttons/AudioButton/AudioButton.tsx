import { MouseEvent } from "react";

import { useAudioInternal } from "../../../hooks/internal/useAudioInternal";
import { useSettingsContext } from "../../../context/SettingsContext";
import { useStylesContext } from "../../../context/StylesContext";

import "./AudioButton.css";

/**
 * Handles toggling of the audio feature.
 */
const AudioButton = () => {
	// handles settings
	const { settings } = useSettingsContext();

	// handles styles
	const { styles } = useStylesContext();

	// handles audio
	const { audioToggledOn, toggleAudio } = useAudioInternal();

	// styles for audio icon
	const audioIconStyle: React.CSSProperties = {
		backgroundImage: `url(${settings.audio?.icon})`,
		fill: "#e8eaed",
		...styles.audioIconStyle
	};

	// styles for audio disabled icon
	const audioIconDisabledStyle: React.CSSProperties = {
		backgroundImage: `url(${settings.audio?.icon})`,
		fill: "#e8eaed",
		...styles.audioIconStyle, // by default inherit the base style
		...styles.audioIconDisabledStyle
	};

	/**
	 * Renders button depending on whether an svg component or image url is provided.
	 */
	const renderButton = () => {
		const IconComponent = audioToggledOn ? settings.audio?.icon : settings.audio?.iconDisabled;
		if (typeof IconComponent === "string") {
			return (
				<span
					className={`rcb-audio-icon-${audioToggledOn ? "on" : "off"}`}
					style={audioToggledOn ? audioIconStyle : audioIconDisabledStyle}
				/>
			)
		}
		return (
			IconComponent &&
			<span className={`rcb-audio-icon-${audioToggledOn ? "on" : "off"}`}>
				<IconComponent style={audioToggledOn ? audioIconStyle : audioIconDisabledStyle}/>
			</span>
		)
	}

	return (
		<div
			aria-label={settings.ariaLabel?.audioButton ?? "toggle audio"}
			role="button" 
			onMouseDown={(event: MouseEvent) => {
				event.preventDefault();
				toggleAudio();
			}}
			style={audioToggledOn
				? styles.audioButtonStyle
				: {...styles.audioButtonStyle, ...styles.audioButtonDisabledStyle}
			}
		>
			{renderButton()}
		</div>
	);
};

export default AudioButton;
