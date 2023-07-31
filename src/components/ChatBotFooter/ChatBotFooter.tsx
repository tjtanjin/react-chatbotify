
import { RefObject } from "react";

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
	openChat,
	getCurrPath,
	getPrevPath,
	handleActionInput
}: {
	inputRef: RefObject<HTMLTextAreaElement>;
	flow: Flow;
	textAreaDisabled: boolean;
	injectMessage: (content: string | JSX.Element, isUser?: boolean) => void;
	openChat: (isOpen: boolean) => void;
	getCurrPath: () => string | null;
	getPrevPath: () => string | null;
	handleActionInput: (path: string, userInput: string, sendUserInput?: boolean) => void;
}) => {

	// handles options for bot
	const { botOptions } = useBotOptions();

	return (
		<div style={botOptions.footerStyle} className="rcb-chat-footer-container">
			<div className="rcb-chat-footer">
				{!botOptions.fileAttachment?.disabled &&
					<FileAttachmentButton inputRef={inputRef} flow={flow} getCurrPath={getCurrPath} openChat={openChat}
						getPrevPath={getPrevPath} handleActionInput={handleActionInput} injectMessage={injectMessage}
					/>
				}
				{!botOptions.emoji?.disabled &&
					<EmojiPicker inputRef={inputRef} textAreaDisabled={textAreaDisabled}/>
				}
			</div>
			<span>{botOptions.footer?.text}</span>
		</div>
	);
};

export default ChatBotFooter;