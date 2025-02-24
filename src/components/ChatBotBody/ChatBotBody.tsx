import { Dispatch, SetStateAction, CSSProperties, useEffect } from "react";

import ChatMessagePrompt from "./ChatMessagePrompt/ChatMessagePrompt";
import { useChatWindowInternal } from "../../hooks/internal/useChatWindowInternal";
import { useBotStatesContext } from "../../context/BotStatesContext";
import { useBotRefsContext } from "../../context/BotRefsContext";
import { useMessagesContext } from "../../context/MessagesContext";
import { useSettingsContext } from "../../context/SettingsContext";
import { useStylesContext } from "../../context/StylesContext";
import UserMessage from "./UserMessage/UserMessage";
import BotMessage from "./BotMessage/BotMessage";
import BotTypingIndicator from "./BotTypingIndicator/BotTypingIndicator";

import "./ChatBotBody.css";

/**
 * Contains chat messages between the user and bot.
 * 
 * @param setChatScrollHeight setter for tracking chat window scroll height
 */
const ChatBotBody = ({
	setChatScrollHeight,
}: {
	setChatScrollHeight: Dispatch<SetStateAction<number>>;
}) => {
	// handles settings
	const { settings } = useSettingsContext();

	// handles styles
	const { styles } = useStylesContext();

	// handles messages
	const { messages } = useMessagesContext();

	// handles chat window
	const { isChatWindowOpen } = useChatWindowInternal();

	// handles bot states
	const {
		isBotTyping,
		isScrolling,
		setIsScrolling,
		setUnreadCount,
	} = useBotStatesContext();

	// handles bot refs
	const { chatBodyRef } = useBotRefsContext();

	// styles for chat body
	const bodyStyle: CSSProperties = {
		...styles?.bodyStyle,
		scrollbarWidth: settings.chatWindow?.showScrollbar ? "auto" : "none",
	};

	// shifts scroll position when scroll height changes and determines if a user is scrolling in chat window.
	useEffect(() => {
		if (!chatBodyRef.current) {
			return;
		}

		// used to return chat history to correct height
		setChatScrollHeight(chatBodyRef.current.scrollHeight);

		if (!isScrolling) {
			chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
		}
	}, [chatBodyRef.current?.scrollHeight]);

	/**
	 * Checks and updates whether a user is scrolling in chat window.
	 */
	const updateIsScrolling = () => {
		if (!chatBodyRef.current) {
			return;
		}

		// used to return chat history to correct height
		setChatScrollHeight(chatBodyRef.current.scrollHeight);

		const { scrollTop, clientHeight, scrollHeight } = chatBodyRef.current;
		const isScrolling = scrollTop + clientHeight < scrollHeight - (settings.chatWindow?.messagePromptOffset ?? 30);
		setIsScrolling(isScrolling);

		// workaround to ensure user never truly scrolls to bottom by introducing a 1 pixel offset
		// this is necessary to prevent unexpected scroll behaviors of the chat window when user reaches the bottom
		if (!isScrolling) {
			if (scrollTop + clientHeight >= scrollHeight - 1) {
				chatBodyRef.current.scrollTop = scrollHeight - clientHeight - 1;
			}

			if (isChatWindowOpen || settings.general?.embedded) {
				setUnreadCount(0);
			}
		}
	};

	/**
	 * Determines if the message is the first in a consecutive series from the same sender.
	 */
	const isFirstInSeries = (index: number): boolean => {
		if (index === 0) {
			return true;
		}
		return messages[index].sender !== messages[index - 1].sender;
	};

	return (
		<div 
			style={bodyStyle}
			className="rcb-chat-body-container"
			ref={chatBodyRef as React.LegacyRef<HTMLDivElement>} 
			onScroll={updateIsScrolling}
		>
			{messages.map((message, index) => {
				const isNewSender = isFirstInSeries(index);

				if (message.sender.toUpperCase() === "USER") {
					return <UserMessage key={index} message={message} isNewSender={isNewSender} />;
				}

				if (message.sender.toUpperCase() === "BOT") {
					return <BotMessage key={index} message={message} isNewSender={isNewSender} />;
				}

				return <div key={index}>{message.content}</div>;
			})}
			{isBotTyping && settings.chatWindow?.showTypingIndicator && (
				<BotTypingIndicator />
			)}
			<ChatMessagePrompt/>
		</div>
	);
};

export default ChatBotBody;
