import { CSSProperties } from 'react';

import { useSettings } from '../../../context/SettingsContext';

import './MediaDisplay.css';

/**
 * Supports showing of media display for users.
 * 
 * @param file file containing the media to display
 * @param fileType type of the file
 * @param fileUrl url resource to the file
 */
const MediaDisplay = ({
	file,
	fileType,
	fileUrl
}: {
	file: File,
	fileType: string | null;
	fileUrl: string | null;
}) => {

	// handles options for bot
	const { settings } = useSettings();

	// styles for media display
	const mediaDisplayContainerStyle: CSSProperties = {
		backgroundColor: settings.theme?.primaryColor,
		maxWidth: settings.userBubble?.showAvatar ? "65%" : "70%",
		...settings.mediaDisplayContainerStyle
	};

	return (
		<>
			{fileUrl ?
				<>
					{fileType === 'image' && fileUrl && (
						<div
							style={mediaDisplayContainerStyle}
							className="rcb-media-display-image-container rcb-media-entry"
						>
							<img src={fileUrl} alt="Image Display" className="rcb-media-display-image" />
						</div>
					)}
					{fileType === 'video' && fileUrl && (
						<div 
							style={mediaDisplayContainerStyle}
							className="rcb-media-display-video-container rcb-media-entry"
						>
							<video controls className="rcb-media-display-video">
								<source src={fileUrl} type={file.type} />
								Your browser does not support the video tag.
							</video>
						</div>
					)}
					{fileType === 'audio' && fileUrl && (
						<audio
							style={{
								maxWidth: settings.userBubble?.showAvatar ? "65%" : "70%",
							}}
							controls className="rcb-media-display-audio rcb-media-entry"
						>
							<source src={fileUrl} type={file.type} />
							Your browser does not support the audio tag.
						</audio>
					)}
				</>
				:
				<></>
			}
		</>
	);
};

export default MediaDisplay;
