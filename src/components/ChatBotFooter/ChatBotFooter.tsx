
import React, { RefObject } from "react";

import EmojiPicker from "./EmojiPicker/EmojiPicker";
import FileAttachmentButton from "./FileAttachmentButton/FileAttachmentButton";
import { useBotOptions } from "../../context/BotOptionsContext";
import { Flow } from "../../types/Flow";

import "./ChatBotFooter.css";

/**
 * Contains attachment button, emoji button and footer text.
 * 
 * @param inputRef reference to the textarea
 * @param flow conversation flow for the bot
 * @param textAreaDisabled boolean indicating if textarea is disabled
 * @param injectMessage utility function for injecting a message into the messages array
 * @param streamMessage utility function for streaming a message into the messages array
 * @param openChat utility function to open/close chat window
 * @param getCurrPath retrieves current path for the user
 * @param getPrevPath retrieves previous path for the user
 * @param handleActionInput handles action input from user 
 */
const ChatBotFooter = ({
	inputRef,
	flow,
	textAreaDisabled,
	injectMessage,
	streamMessage,
	openChat,
	getCurrPath,
	getPrevPath,
	handleActionInput
}: {
	inputRef: RefObject<HTMLTextAreaElement>;
	flow: Flow;
	textAreaDisabled: boolean;
	injectMessage: (content: string | JSX.Element, sender?: string) => Promise<void>;
	streamMessage: (content: string | JSX.Element, sender?: string) => Promise<void>;
	openChat: (isOpen: boolean) => void;
	getCurrPath: () => string | null;
	getPrevPath: () => string | null;
	handleActionInput: (path: string, userInput: string, sendUserInput?: boolean) => Promise<void>;
}) => {

	// handles options for bot
	const { botOptions } = useBotOptions();

	const renderFileAttachment = () => {
		return (
			<FileAttachmentButton inputRef={inputRef}
				flow={flow} getCurrPath={getCurrPath} openChat={openChat}
				getPrevPath={getPrevPath} handleActionInput={handleActionInput} injectMessage={injectMessage}
				streamMessage={streamMessage}
			/>
		)
	}

	const renderEmojiPicker = () => {
		return (<EmojiPicker inputRef={inputRef} textAreaDisabled={textAreaDisabled}/>)
	}

	return (
		<div style={botOptions.footerStyle} className="rcb-chat-footer-container">
			<div className="rcb-chat-footer">
				{botOptions.footer?.buttons?.map((button, index) => {
					if (button === "file-attachment" && !botOptions.fileAttachment?.disabled) {
						return <React.Fragment key={index}>{renderFileAttachment()}</React.Fragment>;
					} else if (button === "emoji-picker" && !botOptions.emoji?.disabled) {
						return <React.Fragment key={index}>{renderEmojiPicker()}</React.Fragment>;
					} else if (React.isValidElement(button)) {
						return <React.Fragment key={index}>{button}</React.Fragment>;
					}
				})}
			</div>
			<span>{botOptions.footer?.text}</span>
		</div>
	);
};

export default ChatBotFooter;
