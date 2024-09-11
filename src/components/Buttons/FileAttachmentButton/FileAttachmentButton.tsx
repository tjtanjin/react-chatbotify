import { ChangeEvent } from "react";

import MediaDisplay from "../../ChatBotBody/MediaDisplay/MediaDisplay";
import { getMediaFileDetails } from "../../../utils/mediaFileParser";
import { useToast } from "../../../hooks/useToast";
import { useChatWindowInternal } from "../../../hooks/internal/useChatWindowInternal";
import { useSubmitInputInternal } from "../../../hooks/internal/useSubmitInputInternal";
import { useMessagesInternal } from "../../../hooks/internal/useMessagesInternal";
import { usePathsInternal } from "../../../hooks/internal/usePathsInternal";
import { useRcbEventInternal } from "../../../hooks/internal/useRcbEventInternal";
import { useTextAreaInternal } from "../../../hooks/internal/useTextAreaInternal";
import { useBotRefsContext } from "../../../context/BotRefsContext";
import { useSettingsContext } from "../../../context/SettingsContext";
import { useStylesContext } from "../../../context/StylesContext";
import { Flow } from "../../../types/Flow";
import { RcbEvent } from "../../../constants/RcbEvent";

import "./FileAttachmentButton.css";

/**
 * Supports uploading of files from user.
 */
const FileAttachmentButton = () => {
	// handles settings
	const { settings } = useSettingsContext();

	// handles styles
	const { styles } = useStylesContext();

	// handles messages
	const { injectMessage, streamMessage } = useMessagesInternal();

	// handles paths and blocks
	const { getCurrPath, getPrevPath, goToPath, blockAllowsAttachment } = usePathsInternal();

	// handles bot refs
	const { flowRef, inputRef } = useBotRefsContext();
	const flow = flowRef.current as Flow;

	// handles toasts
	const { showToast } = useToast();
	
	// handles rcb events
	const { callRcbEvent } = useRcbEventInternal();

	// handles chat window
	const { openChat } = useChatWindowInternal();

	// handles input text area
	const {  setTextAreaValue } = useTextAreaInternal();

	// handles user input submission
	const { handleSubmitText } = useSubmitInputInternal();

	// styles for file attachment disabled button
	const fileAttachmentButtonDisabledStyle = {
		cursor: `url(${settings.general?.actionDisabledIcon}), auto`,
		...styles.fileAttachmentButtonDisabledStyle
	}

	// styles for file attachment icon
	const fileAttachmentIconStyle: React.CSSProperties = {
		backgroundImage: `url(${settings.fileAttachment?.icon})`,
		...styles.fileAttachmentIconStyle
	};

	// styles for file attachment disabled icon
	const fileAttachmentIconDisabledStyle: React.CSSProperties = {
		backgroundImage: `url(${settings.fileAttachment?.icon})`,
		...styles.fileAttachmentIconDisabledStyle
	};

	/**
	 * Handles file uploads from user.
	 * 
	 * @param event file upload event
	 */
	const handleUpload = async (event: ChangeEvent<HTMLInputElement>) => {
		const files = event.target.files;
		if (!files) {
			return;
		}

		// handles user file upload event
		if (settings.event?.rcbUserUploadFile) {
			const event = callRcbEvent(RcbEvent.USER_UPLOAD_FILE, {files});
			if (event.defaultPrevented) {
				return;
			}
		}

		const currPath = getCurrPath();
		if (!currPath) {
			return;
		}
		const block = flow[currPath];
		if (!block) {
			return;
		}
		const fileHandler = block.file
		if (fileHandler != null) {
			const fileNames = [];
			for (let i = 0; i < files.length; i++) {
				fileNames.push(files[i].name);
				// checks if media (i.e. image, video, audio should be displayed)
				if (!settings.fileAttachment?.showMediaDisplay) {
					continue;
				}

				// retrieves file details and skips if not image, video or audio
				const fileDetails = await getMediaFileDetails(files[i]);
				if (!fileDetails.fileType || !fileDetails.fileUrl) {
					continue;
				}

				// sends media display if file details are valid
				await injectMessage(<MediaDisplay file={files[i]} fileType={fileDetails.fileType}
					fileUrl={fileDetails.fileUrl}/>, "user");
			}
			await handleSubmitText("📄 " + fileNames.join(", "), settings.fileAttachment?.sendFileName);
			await fileHandler({userInput: inputRef.current?.value as string, prevPath: getPrevPath(),
				goToPath, setTextAreaValue, injectMessage, streamMessage, openChat, showToast, files});
		}
	};

	return (
		<>
			{blockAllowsAttachment ? (
				<label
					className="rcb-attach-button-enabled"
					style={styles.fileAttachmentButtonStyle}
				>
					<input
						className="rcb-attach-input"
						type="file"
						onChange={handleUpload}
						multiple={settings.fileAttachment?.multiple}
						accept={settings.fileAttachment?.accept}
					/>
					<span
						className="rcb-attach-icon-enabled"
						style={fileAttachmentIconStyle}
					/>
				</label>
			) : (
				<label 
					className="rcb-attach-button-disabled"
					style={fileAttachmentButtonDisabledStyle}
				>
					<input disabled type="file" />
					<span 
						className="rcb-attach-icon-disabled"
						style={fileAttachmentIconDisabledStyle}
					>
					</span>
				</label>
			)}
		</>
	);
};

export default FileAttachmentButton;
