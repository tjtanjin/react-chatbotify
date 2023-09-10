import { ChangeEvent, RefObject, useEffect, useState } from "react";

import { useBotOptions } from "../../../context/BotOptionsContext";
import { usePaths } from "../../../context/PathsContext";
import { Flow } from "../../../types/Flow";

import "./FileAttachmentButton.css";

/**
 * Supports uploading of files from user.
 * 
 * @param inputRef reference to the textarea
 * @param flow conversation flow for the bot
 * @param injectMessage utility function for injecting a message into the messages array
 * @param openChat utility function to open/close chat window
 * @param getCurrPath retrieves current path for the user
 * @param getPrevPath retrieves previous path for the user
 * @param handleActionInput handles action input from user 
 */
const FileAttachmentButton = ({
	inputRef,
	flow,
	injectMessage,
	openChat,
	getCurrPath,
	getPrevPath,
	handleActionInput
}: {
	inputRef: RefObject<HTMLTextAreaElement>;
	flow: Flow;
	injectMessage: (content: string | JSX.Element, isUser?: boolean) => void;
	openChat: (isOpen: boolean) => void;
	getCurrPath: () => string | null;
	getPrevPath: () => string | null;
	handleActionInput: (path: string, userInput: string, sendUserInput?: boolean) => void;
}) => {

	// handles options for bot
	const { botOptions } = useBotOptions();

	// handles paths of the user
	const { paths } = usePaths();

	// handles whether attachments are allowed for the current block that user is in
	const [blockAllowsAttachment, setBlockAllowsAttachment] = useState<boolean>(false);

	// checks if attachments are allowed on every path traversal into another block
	useEffect(() => {
		const currPath = getCurrPath();
		if (currPath == null) {
			return;
		}
		const block = flow[currPath];

		// if path is invalid, nothing to process (i.e. becomes dead end!)
		if (block == null) {
			return;
		}
		setBlockAllowsAttachment(typeof block.file === "function");
	}, [paths]);

	/**
	 * Handles file uploads from user.
	 * 
	 * @param event file upload event
	 */
	const handleUpload = async (event: ChangeEvent<HTMLInputElement>) => {
		const files = event.target.files;
		if (files == null) {
			return;
		}

		const currPath = getCurrPath();
		if (currPath == null) {
			return;
		}
		const block = flow[currPath];
		const fileHandler = block.file
		if (fileHandler != null) {
			const fileNames = [];
			for (let i = 0; i < files.length; i++) {
				fileNames.push(files[i].name);
			}
			handleActionInput(currPath, "📄 " + fileNames.join(", "), botOptions.chatInput?.sendAttachmentOutput);
			await fileHandler({userInput: inputRef.current?.value as string, prevPath: getPrevPath(),
				injectMessage, openChat, files});
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