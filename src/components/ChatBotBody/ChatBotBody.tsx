import { RefObject, Dispatch, SetStateAction, useEffect } from "react";

import { useBotOptions } from "../../context/BotOptionsContext";
import { useMessages } from "../../context/MessagesContext";
import { Message } from "../../types/Message";

import "./ChatBotBody.css";

/**
 * Contains chat messages between the user and bot.
 * 
 * @param chatContainerRef reference to the chat container
 * @param isBotTyping boolean indicating if bot is typing
 * @param isLoadingChatHistory boolean indicating is chat history is being loaded
 * @param prevScrollHeight number representing previously scrolled height
 * @param setPrevScrollHeight setter for tracking scroll height
 */
const ChatBotBody = ({
	chatContainerRef,
	isBotTyping,
	isLoadingChatHistory,
	prevScrollHeight,
	setPrevScrollHeight
}: {
	chatContainerRef: RefObject<HTMLDivElement>;
	isBotTyping: boolean;
	isLoadingChatHistory: boolean;
	prevScrollHeight: number;
	setPrevScrollHeight: Dispatch<SetStateAction<number>>;
}) => {

	// handles options for bot
	const { botOptions } = useBotOptions();

	// handles messages between user and the chat bot
	const { messages } = useMessages();

	// styles for user bubble
	const userBubbleStyle = {
		backgroundColor: botOptions.theme?.primaryColor,
		color: "#fff",
		maxWidth: botOptions.userBubble?.showAvatar ? "65%" : "70%",
		...botOptions.userBubbleStyle
	};

	// styles for bot bubble
	const botBubbleStyle = {
		backgroundColor: botOptions.theme?.secondaryColor,
		color: "#fff",
		maxWidth: botOptions.botBubble?.showAvatar ? "65%" : "70%",
		...botOptions.botBubbleStyle
	};

	// shifts scroll position when messages are updated and when bot is typing
	useEffect(() => {
		if (isLoadingChatHistory && chatContainerRef.current != null) {
			const { scrollHeight } = chatContainerRef.current;
			const scrollDifference = scrollHeight - prevScrollHeight;
			chatContainerRef.current.scrollTop = chatContainerRef.current.scrollTop + scrollDifference;
			setPrevScrollHeight(scrollHeight);
			return;
		}

		if (chatContainerRef.current != null) {
			chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
		}
	}, [messages, isBotTyping]);

	/**
	 * Updates scroll height within the chat container.
	 */
	const updateScrollHeight = () => {
		if (chatContainerRef?.current != null) {
			setPrevScrollHeight(chatContainerRef.current.scrollHeight);
		}
	};

	/**
	 * Renders message from the user.
	 * 
	 * @param message message to render
	 */
	const renderUserMessage = (message: Message) => {
		return (
			<>
				<div
					style={userBubbleStyle}
					className="rcb-user-message"
				>
					{message.content}
				</div>
				{botOptions.userBubble?.showAvatar &&
					<div 
						style={{backgroundImage: `url(${botOptions.userBubble?.avatarImage})`}}
						className="rcb-message-user-avatar"
					/>
				}
			</>
		);
	};
	
	/**
	 * Renders message from the bot.
	 * 
	 * @param message message to render
	 */
	const renderBotMessage = (message: Message) => {
		return (
			<>
				{botOptions.botBubble?.showAvatar &&
					<div
						style={{backgroundImage: `url(${botOptions.botBubble?.avatarImage})`}}
						className="rcb-message-bot-avatar"
					/>
				}
				<div
					style={botBubbleStyle}
					className="rcb-bot-message"
				>
					{message.content}
				</div>
			</>
		);
	};
	
	return (
		<div className="rcb-chat-container" ref={chatContainerRef} onScroll={updateScrollHeight}>
			{messages.map((message, index) => {
				if (typeof message.content !== "string") {
					return <div key={index}>{message.content}</div>;
				}
		
				return (
					<div 
						key={index} 
						className={message.isUser ? "rcb-user-message-container" : "rcb-bot-message-container"}
					>
						{message.isUser ? renderUserMessage(message) : renderBotMessage(message)}
					</div>
				);
			})}
			{isBotTyping && (
				<div className="rcb-bot-message-container">
					{botOptions.botBubble?.showAvatar &&
						<div 
							style={{backgroundImage: `url(${botOptions.botBubble?.avatarImage})`}}
							className="rcb-message-bot-avatar"
						/>
					}
					<div className="rcb-bot-message">
						<div className="rcb-typing-indicator">
							<span className="rcb-dot"/>
							<span className="rcb-dot"/>
							<span className="rcb-dot"/>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default ChatBotBody;