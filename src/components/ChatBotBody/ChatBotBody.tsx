import { RefObject, Dispatch, SetStateAction, useEffect, CSSProperties, MouseEvent } from "react";

import ChatMessagePrompt from "./ChatMessagePrompt/ChatMessagePrompt";
import { useBotOptions } from "../../context/BotOptionsContext";
import { useMessages } from "../../context/MessagesContext";
import { Message } from "../../types/Message";

import "./ChatBotBody.css";

/**
 * Contains chat messages between the user and bot.
 * 
 * @param chatBodyRef reference to the chat body
 * @param isBotTyping boolean indicating if bot is typing
 * @param isLoadingChatHistory boolean indicating is chat history is being loaded
 * @param chatScrollHeight number representing chat window scroll height
 * @param setChatScrollHeight setter for tracking chat window scroll height
 * @param setIsLoadingChatHistory setter for tracking whether is loading history
 * @param isScrolling boolean representing whether user is scrolling chat
 * @param setIsScrolling setter for tracking if user is scrolling
 * @param unreadCount number representing unread messages count
 * @param setUnreadCount setter for unread messages count
 */
const ChatBotBody = ({
	chatBodyRef,
	isBotTyping,
	isLoadingChatHistory,
	chatScrollHeight,
	setChatScrollHeight,
	setIsLoadingChatHistory,
	isScrolling: isScrolling,
	setIsScrolling,
	unreadCount,
	setUnreadCount,
}: {
	chatBodyRef: RefObject<HTMLDivElement>;
	isBotTyping: boolean;
	isLoadingChatHistory: boolean;
	chatScrollHeight: number;
	setChatScrollHeight: Dispatch<SetStateAction<number>>;
	setIsLoadingChatHistory: Dispatch<SetStateAction<boolean>>;
	isScrolling: boolean;
	setIsScrolling: Dispatch<SetStateAction<boolean>>;
	unreadCount: number;
	setUnreadCount: Dispatch<SetStateAction<number>>;
}) => {

	// handles options for bot
	const { botOptions } = useBotOptions();

	// handles messages between user and the chat bot
	const { messages } = useMessages();

	// styles for chat body
	const bodyStyle: CSSProperties = {
		...botOptions?.bodyStyle,
		scrollbarWidth: botOptions.chatWindow?.showScrollbar ? "auto" : "none",
	}

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
		if (!chatBodyRef.current) {
			return;
		}

		if (isLoadingChatHistory) {
			const { scrollHeight } = chatBodyRef.current;
			const scrollDifference = scrollHeight - chatScrollHeight;
			chatBodyRef.current.scrollTop = chatBodyRef.current.scrollTop + scrollDifference;
			setIsLoadingChatHistory(false);
			return;
		}

		if (botOptions.chatWindow?.autoJumpToBottom || !isScrolling) {
			console.log(!isScrolling);
			chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
			if (botOptions.isOpen) {
				setUnreadCount(0);
			}
		}
	}, [messages.length, isBotTyping]);

	// shifts scroll position when scroll height changes
	useEffect(() => {
		if (!chatBodyRef.current) {
			return;
		}

		// used to return chat history to correct height
		setChatScrollHeight(chatBodyRef.current.scrollHeight);

		if (!isScrolling) {
			chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
			if (botOptions.isOpen) {
				setUnreadCount(0);
			}
		}
	}, [chatBodyRef.current?.scrollHeight, isScrolling]);

	/**
	 * Checks and updates whether a user is scrolling in chat window.
	 */
	const updateIsScrolling = () => {
		if (!chatBodyRef.current) {
			return;
		}

		const { scrollTop, clientHeight, scrollHeight } = chatBodyRef.current;
		setIsScrolling(
			scrollTop + clientHeight < scrollHeight - (botOptions.chatWindow?.messagePromptOffset || 30)
		);
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
						style={{backgroundImage: `url(${botOptions.userBubble?.avatar})`}}
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
						style={{backgroundImage: `url(${botOptions.botBubble?.avatar})`}}
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
		<div 
			style={bodyStyle}
			className="rcb-chat-body-container"
			ref={chatBodyRef} 
			onScroll={updateIsScrolling}
		>
			{messages.map((message, index) => {
				if (typeof message.content !== "string") {
					return <div key={index}>{message.content}</div>;
				}
		
				return (
					<div 
						key={index} 
						className={message.sender === "user"
							? "rcb-user-message-container"
							: "rcb-bot-message-container"
						}
					>
						{message.sender === "user" ? renderUserMessage(message) : renderBotMessage(message)}
					</div>
				);
			})}
			{isBotTyping && (
				<div className="rcb-bot-message-container">
					{botOptions.botBubble?.showAvatar &&
						<div 
							style={{backgroundImage: `url(${botOptions.botBubble?.avatar})`}}
							className="rcb-message-bot-avatar"
						/>
					}
					<div 
						onMouseDown={(event: MouseEvent) => {
							event.preventDefault();
						}}
						className="rcb-bot-message"
					>
						<div className="rcb-typing-indicator">
							<span className="rcb-dot"/>
							<span className="rcb-dot"/>
							<span className="rcb-dot"/>
						</div>
					</div>
				</div>
			)}
			<ChatMessagePrompt
				chatBodyRef={chatBodyRef} isScrolling={isScrolling}
				setIsScrolling={setIsScrolling} unreadCount={unreadCount}
			/>
		</div>
	);
};

export default ChatBotBody;