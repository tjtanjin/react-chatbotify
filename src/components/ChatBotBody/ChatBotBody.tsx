import { RefObject, Dispatch, SetStateAction, useEffect, CSSProperties, MouseEvent } from "react";

import ChatMessagePrompt from "./ChatMessagePrompt/ChatMessagePrompt";
import { useSettings } from "../../context/SettingsContext";
import { useBotStyles } from "../../context/BotStylesContext";
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

	// handles settings for bot
	const { settings } = useSettings();

	// handles styles for bot
	const { botStyles } = useBotStyles();

	// handles messages between user and the chat bot
	const { messages } = useMessages();

	// styles for chat body
	const bodyStyle: CSSProperties = {
		...botStyles?.bodyStyle,
		scrollbarWidth: settings.chatWindow?.showScrollbar ? "auto" : "none",
	}

	// styles for user bubble
	const userBubbleStyle: CSSProperties = {
		backgroundColor: settings.general?.primaryColor,
		color: "#fff",
		maxWidth: settings.userBubble?.showAvatar ? "65%" : "70%",
		...botStyles.userBubbleStyle
	};
	const userBubbleEntryStyle = settings.userBubble?.animate ? "rcb-user-message-entry" : "";

	// styles for bot bubble
	const botBubbleStyle: CSSProperties = {
		backgroundColor: settings.general?.secondaryColor,
		color: "#fff",
		maxWidth: settings.botBubble?.showAvatar ? "65%" : "70%",
		...botStyles.botBubbleStyle
	};
	const botBubbleEntryStyle = settings.botBubble?.animate ? "rcb-bot-message-entry" : "";

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

		if (settings.chatWindow?.autoJumpToBottom || !isScrolling) {
			chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
			if (settings.isOpen) {
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
			if (settings.isOpen) {
				setUnreadCount(0);
			}
		}
	}, [chatBodyRef.current?.scrollHeight]);

	// sets unread count to 0 if not scrolling
	useEffect(() => {
		if (!isScrolling) {
			setUnreadCount(0);
		}
	}, [isScrolling]);

	/**
	 * Checks and updates whether a user is scrolling in chat window.
	 */
	const updateIsScrolling = () => {
		if (!chatBodyRef.current) {
			return;
		}
		const { scrollTop, clientHeight, scrollHeight } = chatBodyRef.current;
		setIsScrolling(
			scrollTop + clientHeight < scrollHeight - (settings.chatWindow?.messagePromptOffset || 30)
		);

		// workaround to ensure user never truly scrolls to bottom by introducing a 1 pixel offset
		// this is necessary to prevent unexpected scroll behaviors of the chat window when user reaches the bottom
		if (!isScrolling && scrollTop + clientHeight >= scrollHeight - 1) {
			chatBodyRef.current.scrollTop = scrollHeight - clientHeight - 1;
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

	/**
	 * Renders message from the user.
	 * 
	 * @param message message to render
	 */
	const renderUserMessage = (message: Message, index: number) => {
		const isNewSender = isFirstInSeries(index);
		const showAvatar = settings.userBubble?.showAvatar && isNewSender;
		let offsetStyle = "rcb-user-message";
		if (!isNewSender && settings.userBubble?.showAvatar) {
			offsetStyle += " rcb-user-message-offset";
		}
		return (
			<div className="rcb-user-message-container">
				{typeof message.content === "string" ? (
					settings?.userBubble?.dangerouslySetInnerHtml ? (
						<div
							style={{ ...userBubbleStyle, display: "inline" }}
							className={`${offsetStyle} ${userBubbleEntryStyle}`}
							dangerouslySetInnerHTML={{ __html: message.content }}
						/>
					) : (
						<div
							style={userBubbleStyle}
							className={`${offsetStyle} ${userBubbleEntryStyle}`}
						>
							{message.content}
						</div>
					)
				) : (
					message.content
				)}
				{showAvatar && (
					<div
						style={{ backgroundImage: `url(${settings.userBubble?.avatar})` }}
						className="rcb-message-user-avatar"
					/>
				)}
			</div>
		);
	};

	/**
	 * Renders message from the bot.
	 * 
	 * @param message message to render
	 */
	const renderBotMessage = (message: Message, index: number) => {
		const isNewSender = isFirstInSeries(index);
		const showAvatar = settings.botBubble?.showAvatar && isNewSender;
		let offsetStyle = "rcb-bot-message";
		if (!isNewSender && settings.botBubble?.showAvatar) {
			offsetStyle += " rcb-bot-message-offset";
		}
		return (
			<div className="rcb-bot-message-container">
				{showAvatar && (
					<div
						style={{ backgroundImage: `url(${settings.botBubble?.avatar})` }}
						className="rcb-message-bot-avatar"
					/>
				)}
				{typeof message.content === "string" ? (
					settings?.botBubble?.dangerouslySetInnerHtml ? (
						<div
							style={{ ...botBubbleStyle, display: "inline" }}
							className={`${offsetStyle} ${botBubbleEntryStyle}`}
							dangerouslySetInnerHTML={{ __html: message.content }}
						/>
					) : (
						<div
							style={botBubbleStyle}
							className={`${offsetStyle} ${botBubbleEntryStyle}`}
						>
							{message.content}
						</div>
					)
				) : (
					message.content
				)}
			</div>
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
				if (message.sender === "system") {
					return <div key={index}>{message.content}</div>
				}

				return (
					<div key={index}>
						{message.sender === "user"
							? renderUserMessage(message, index)
							: renderBotMessage(message, index)}
					</div>
				);
			})}
			{isBotTyping && (
				<div className="rcb-bot-message-container">
					{settings.botBubble?.showAvatar &&
						<div 
							style={{backgroundImage: `url(${settings.botBubble?.avatar})`}}
							className="rcb-message-bot-avatar"
						/>
					}
					<div 
						onMouseDown={(event: MouseEvent) => {
							event.preventDefault();
						}}
						className={`rcb-bot-message ${botBubbleEntryStyle}`}
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