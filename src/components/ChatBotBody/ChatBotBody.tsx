import { Dispatch, SetStateAction, CSSProperties, MouseEvent, useEffect } from "react";

import ChatMessagePrompt from "./ChatMessagePrompt/ChatMessagePrompt";
import { useChatWindowInternal } from "../../hooks/internal/useChatWindowInternal";
import { useBotStatesContext } from "../../context/BotStatesContext";
import { useBotRefsContext } from "../../context/BotRefsContext";
import { useMessagesContext } from "../../context/MessagesContext";
import { useSettingsContext } from "../../context/SettingsContext";
import { useStylesContext } from "../../context/StylesContext";
import { Message } from "../../types/Message";

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

	// styles for user bubble
	const userBubbleStyle: CSSProperties = {
		backgroundColor: settings.general?.primaryColor,
		color: "#fff",
		maxWidth: settings.userBubble?.showAvatar ? "65%" : "70%",
		...styles.userBubbleStyle
	};
	const userBubbleEntryStyle = settings.userBubble?.animate ? "rcb-user-message-entry" : "";

	// styles for bot bubble
	const botBubbleStyle: CSSProperties = {
		backgroundColor: settings.general?.secondaryColor,
		color: "#fff",
		maxWidth: settings.botBubble?.showAvatar ? "65%" : "70%",
		...styles.botBubbleStyle
	};
	const botBubbleEntryStyle = settings.botBubble?.animate ? "rcb-bot-message-entry" : "";

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
			ref={chatBodyRef as React.LegacyRef<HTMLDivElement>} 
			onScroll={updateIsScrolling}
		>
			{messages.map((message, index) => {
				if (message.sender.toUpperCase() === "SYSTEM") {
					return <div key={index}>{message.content}</div>
				}

				return (
					<div key={index}>
						{message.sender.toUpperCase() === "USER"
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
						<div className="rcb-typing-indicator" style={{...styles?.rcbTypingIndicatorContainerStyle}}>
							<span className="rcb-dot" style={{...styles?.rcbTypingIndicatorDotStyle}}/>
							<span className="rcb-dot" style={{...styles?.rcbTypingIndicatorDotStyle}}/>
							<span className="rcb-dot" style={{...styles?.rcbTypingIndicatorDotStyle}}/>
						</div>
					</div>
				</div>
			)}
			<ChatMessagePrompt/>
		</div>
	);
};

export default ChatBotBody;
