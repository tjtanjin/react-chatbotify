import { useCallback } from "react";

import { processAudio } from "../../services/AudioService";
import { saveChatHistory } from "../../services/ChatHistoryService";
import { createMessage } from "../../utils/messageBuilder";
import { parseMarkupMessage } from "../../utils/markupParser";
import { isChatBotVisible } from "../../utils/displayChecker";
import { useNotificationInternal } from "./useNotificationsInternal";
import { useRcbEventInternal } from "./useRcbEventInternal";
import { useSettingsContext } from "../../context/SettingsContext";
import { useMessagesContext } from "../../context/MessagesContext";
import { useBotStatesContext } from "../../context/BotStatesContext";
import { useBotRefsContext } from "../../context/BotRefsContext";
import { Message } from "../../types/Message";
import { RcbEvent } from "../../constants/RcbEvent";

/**
 * Internal custom hook for managing sending of messages.
 */
export const useMessagesInternal = () => {
	// handles settings
	const { settings } = useSettingsContext();

	// handles messages
	const { messages, setMessages } = useMessagesContext();

	// handles bot states
	const {
		audioToggledOn,
		isChatWindowOpen,
		isScrolling,
		setIsBotTyping,
		setUnreadCount
	} = useBotStatesContext();

	// handles bot refs
	const { streamMessageMap, chatBodyRef } = useBotRefsContext();

	// handles rcb events
	const { callRcbEvent } = useRcbEventInternal();
	
	// handles notification
	const { playNotificationSound } = useNotificationInternal();

	/**
	 * Simulates the streaming of a message from the bot.
	 * 
	 * @param message message to stream
	 * @param streamSpeed speed to stream the message
	 * @param useMarkup boolean indicating whether markup is used
	 */
	const simulateStream = useCallback(async (message: Message, streamSpeed: number, useMarkup: boolean) => {
		// always convert to uppercase for checks
		message.sender = message.sender.toUpperCase();
		
		// stop bot typing when simulating stream
		setIsBotTyping(false);

		// set an initial empty message to be used for simulating streaming
		const placeholderMessage = createMessage("", message.sender);
		setMessages(prevMessages => {
			const updatedMessages = [...prevMessages, placeholderMessage];
			handlePostMessagesUpdate(updatedMessages);
			return updatedMessages;
		});

		// initialize default message to empty with stream index position 0
		let streamMessage = message.content as string | string[];
		if (useMarkup) {
			streamMessage = parseMarkupMessage(streamMessage as string);
		}
		let streamIndex = 0;
		const endStreamIndex = streamMessage.length;

		const simStreamDoneTask: Promise<void> = new Promise(resolve => {
			const intervalId = setInterval(() => {
			// consider streaming done once end index is reached or exceeded
			// when streaming is done, remove task and resolve the promise
				if (streamIndex >= endStreamIndex) {
					clearInterval(intervalId);
					resolve();
					return;
				}

				setMessages((prevMessages) => {
					const updatedMessages = [...prevMessages];
					for (let i = updatedMessages.length - 1; i >= 0; i--) {
						if (updatedMessages[i].id === placeholderMessage.id) {
							const character = streamMessage[streamIndex];
							if (character) {
								placeholderMessage.content += character;
								updatedMessages[i] = placeholderMessage;
							}
							streamIndex++;
							break;
						}
					}
					return updatedMessages;
				});
			}, streamSpeed);
		});

		await simStreamDoneTask;
		saveChatHistory(messages);
	}, [messages]);

	/**
	 * Injects a message at the end of the messages array.
	 * 
	 * @param content message content to inject
	 * @param sender sender of the message, defaults to bot
	 */
	const injectMessage = useCallback(async (content: string | JSX.Element,
		sender = "BOT"): Promise<string | null> => {

		// always convert to uppercase for checks
		sender = sender.toUpperCase();

		let message = createMessage(content, sender);

		// handles pre-message inject event
		if (settings.event?.rcbPreInjectMessage) {
			const event = await callRcbEvent(RcbEvent.PRE_INJECT_MESSAGE, {message});
			if (event.defaultPrevented) {
				return null;
			}
			message = event.data.message;
		}

		let useMarkup = false;
		if (sender === "BOT") {
			useMarkup = settings.botBubble?.dangerouslySetInnerHtml as boolean;
		} else if (sender === "USER") {
			useMarkup = settings.userBubble?.dangerouslySetInnerHtml as boolean;
		}

		processAudio(settings, audioToggledOn, isChatWindowOpen, message, useMarkup);
		const isBotStream = typeof message.content === "string"
			&& message.sender === "BOT" && settings?.botBubble?.simStream;
		const isUserStream = typeof message.content === "string"
			&& message.sender === "USER" && settings?.userBubble?.simStream;

		// handles post-message inject event
		setUnreadCount(prev => prev + 1);
		if (settings.event?.rcbPostInjectMessage) {
			await callRcbEvent(RcbEvent.POST_INJECT_MESSAGE, {message});
		}

		if (isBotStream) {
			const streamSpeed = settings.botBubble?.streamSpeed as number;
			await simulateStream(message, streamSpeed, useMarkup);
		} else if (isUserStream) {
			const streamSpeed = settings.userBubble?.streamSpeed as number;
			await simulateStream(message, streamSpeed, useMarkup);
		} else {
			setMessages((prevMessages) => {
				const updatedMessages = [...prevMessages, message];
				handlePostMessagesUpdate(updatedMessages);
				return updatedMessages;
			});
		}

		return message.id;
	}, [settings, audioToggledOn, isChatWindowOpen, callRcbEvent, simulateStream]);

	/**
	 * Removes a message with the given id.
	 */
	const removeMessage = useCallback(async (messageId: string): Promise<string | null> => {
		const message = messages.find(msg => msg.id === messageId);

		// nothing to remove if no such message
		if (!message) {
			return null;
		}
	
		// handles remove message event
		if (settings.event?.rcbRemoveMessage) {
			const event = await callRcbEvent(RcbEvent.REMOVE_MESSAGE, {message});
			if (event.defaultPrevented) {
				return null;
			}
		}

		setMessages((prevMessages) => {
			const updatedMessages = prevMessages.filter(message => message.id !== messageId);
			handlePostMessagesUpdate(updatedMessages);
			return updatedMessages;
		});
		setUnreadCount((prevCount) => Math.max(prevCount - 1, 0));
		return messageId;
	}, [callRcbEvent, messages, settings.event?.rcbRemoveMessage]);

	/**
	 * Streams data into the last message at the end of the messages array with given type.
	 * 
	 * @param content message content to inject
	 * @param sender sender of the message, defaults to bot
	 */
	const streamMessage = useCallback(async (content: string | JSX.Element,
		sender = "BOT"): Promise<string | null> => {

		// always convert to uppercase for checks
		sender = sender.toUpperCase();

		if (!streamMessageMap.current.has(sender)) {
			const message = createMessage(content, sender);
			// handles start stream message event
			if (settings.event?.rcbStartStreamMessage) {
				const event = await callRcbEvent(RcbEvent.START_STREAM_MESSAGE, {message});
				if (event.defaultPrevented) {
					return null;
				}
			}

			setIsBotTyping(false);
			setMessages((prevMessages) => {
				const updatedMessages = [...prevMessages, message];
				handlePostMessagesUpdate(updatedMessages);
				return [...prevMessages, message];
			});
			setUnreadCount(prev => prev + 1);
			streamMessageMap.current.set(sender, message.id);
			return message.id;
		}

		const message = {...createMessage(content, sender), id: streamMessageMap.current.get(sender) as string};
		// handles chunk stream message event
		if (settings.event?.rcbChunkStreamMessage) {
			const event = await callRcbEvent(RcbEvent.CHUNK_STREAM_MESSAGE, message);
			if (event.defaultPrevented) {
				return null;
			}
		}

		setMessages((prevMessages) => {
			const updatedMessages = [...prevMessages];

			for (let i = updatedMessages.length - 1; i >= 0; i--) {
				if (updatedMessages[i].id === message.id) {
					updatedMessages[i] = message;
					break;
				}
			}
			handlePostMessagesUpdate(updatedMessages)
			return updatedMessages;
		});
		return streamMessageMap.current.get(sender) ?? null;
	},[callRcbEvent, settings.event?.rcbChunkStreamMessage, settings.event?.rcbStartStreamMessage, streamMessageMap]);

	/**
	 * Sets the streaming mode of the chatbot.
	 * 
	 * @param sender sender whose stream is being ended
	 * 
	 * Note: This is currently not critical to the functioning of `params.streamMessage` as the chatbot
	 * automatically sets stream mode to true, and defaults to setting stream mode to false whenever a path
	 * change is detected. This is however not ideal, because it results in lossy saving of chat history
	 * for stream messages (cannot detect end stream accurately) and introduces unnecessary logic handling.
	 * The matter of fact is that users know best when a stream ends so the ideal use case would be for users
	 * to call `endStreamMessage()` when they're done with `params.streamMessage`. In v3, this behavior will
	 * be made mandatory. Another key implication of not using `endStreamMessage` in v2 is that the stop stream
	 * message event will not be emitted, which may be problematic for logic (or plugins) that rely on this event.
	 */
	const endStreamMessage = useCallback(async (sender = "BOT"): Promise<boolean> => {
		// always convert to uppercase for checks
		sender = sender.toUpperCase();

		// nothing to end if not streaming
		if (!streamMessageMap.current.has(sender)) {
			return true;
		}

		const messageId = streamMessageMap.current.get(sender);
		const messageToEndStreamFor = messages.find((message) => message.id === messageId);

		// handles stop stream message event
		if (settings.event?.rcbStopStreamMessage) {
			const event = await callRcbEvent(RcbEvent.STOP_STREAM_MESSAGE, {messageToEndStreamFor});
			if (event.defaultPrevented) {
				return false;
			}
		}

		// remove sender from streaming list and save messages
		streamMessageMap.current.delete(sender);
		saveChatHistory(messages);
		return true;
	}, [callRcbEvent, messages, settings.event?.rcbStopStreamMessage, streamMessageMap])

	/**
	 * Handles post messages updates such as saving chat history, scrolling to bottom
	 * and playing notification sound.
	 */
	const handlePostMessagesUpdate = (updatedMessages: Array<Message>) => {
		saveChatHistory(updatedMessages);

		// tracks if notification should be played
		let shouldNotify = true;

		// if messages are empty or chatbot is open and user is not scrolling, no need to notify
		if (updatedMessages.length === 0 || isChatWindowOpen && !isScrolling) {
			shouldNotify = false;
		}

		// if chatbot is embedded and visible, no need to notify
		if (settings.general?.embedded && isChatBotVisible(chatBodyRef.current as HTMLDivElement)) {
			shouldNotify = false;
		}

		const lastMessage = updatedMessages[updatedMessages.length - 1];
		// if message is sent by user or is bot typing or bot is embedded, return
		if (!lastMessage || lastMessage.sender.toUpperCase() === "USER") {
			shouldNotify = false;
		}

		if (shouldNotify) {
			playNotificationSound();
		}

		// if auto scroll enabled or is not scrolling, then scroll to bottom
		if (settings.chatWindow?.autoJumpToBottom || !isScrolling) {
			// defer update to next event loop, handles edge case where messages are sent too fast
			// and the scrolling does not properly reach the bottom
			setTimeout(() => {
				if (!chatBodyRef.current) {
					return;
				}

				chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
			}, 1)
		}
	}

	/**
	 * Replaces (overwrites entirely) the current messages with the new messages.
	 */
	const replaceMessages = useCallback((newMessages: Array<Message>) => {
		handlePostMessagesUpdate(newMessages);
		setMessages(newMessages);
	}, [handlePostMessagesUpdate])

	return {
		endStreamMessage,
		injectMessage,
		removeMessage,
		streamMessage,
		messages,
		replaceMessages
	};
};
