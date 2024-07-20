import { ChangeEvent, RefObject } from "react";

import MediaDisplay from "../../ChatBotBody/MediaDisplay/MediaDisplay";
import { getMediaFileDetails } from "../../../utils/mediaFileParser";
import { useBotOptions } from "../../../context/BotOptionsContext";
import { Flow } from "../../../types/Flow";

import "./FileAttachmentButton.css";

/**
 * Supports uploading of files from user.
 * 
 * @param inputRef reference to the textarea
 * @param flow conversation flow for the bot
 * @param injectMessage utility function for injecting a message into the messages array
 * @param streamMessage utility function for streaming a message into the messages array
 * @param openChat utility function to open/close chat window
 * @param getCurrPath retrieves current path for the user
 * @param getPrevPath retrieves previous path for the user
 * @param handleActionInput handles action input from user 
 */
const FileAttachmentButton = ({
	inputRef,
	flow,
	blockAllowsAttachment,
	injectMessage,
	streamMessage,
	openChat,
	getCurrPath,
	getPrevPath,
	handleActionInput
}: {
	inputRef: RefObject<HTMLTextAreaElement | HTMLInputElement>;
	flow: Flow;
	blockAllowsAttachment: boolean;
	injectMessage: (content: string | JSX.Element, sender?: string) => Promise<void>;
	streamMessage: (content: string | JSX.Element, sender?: string) => Promise<void>;
	openChat: (isOpen: boolean) => void;
	getCurrPath: () => keyof Flow | null;
	getPrevPath: () => keyof Flow | null;
	handleActionInput: (path: keyof Flow, userInput: string, sendUserInput?: boolean) => Promise<void>;
}) => {

	// handles options for bot
	const { botOptions } = useBotOptions();

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
				if (!botOptions.fileAttachment?.showMediaDisplay) {
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
			await handleActionInput(currPath, "📄 " + fileNames.join(", "), botOptions.chatInput?.sendAttachmentOutput);
			await fileHandler({userInput: inputRef.current?.value as string, prevPath: getPrevPath(),
				injectMessage, streamMessage, openChat, files});
		}
	};

	return (
		<>
			{blockAllowsAttachment ? (
				<label className="rcb-attach-button-enabled">
					<input
						className="rcb-attach-input"
						type="file"
						onChange={handleUpload}
						multiple={botOptions.fileAttachment?.multiple}
						accept={botOptions.fileAttachment?.accept}
					/>
					<span
						style={{backgroundImage: `url(${botOptions.fileAttachment?.icon})`}}
						className="rcb-attach-icon-enabled"
					/>
				</label>
			) : (
				<label 
					className="rcb-attach-button-disabled"
					style={{cursor: `url(${botOptions.theme?.actionDisabledIcon}), auto`}}
				>
					<input disabled type="file" />
					<span 
						style={{
							backgroundImage: `url(${botOptions.fileAttachment?.icon})`
						}} 
						className="rcb-attach-icon-disabled"
					>
					</span>
				</label>
			)}
		</>
	);
};

export default FileAttachmentButton;