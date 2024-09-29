import { useCallback } from "react";

import { processAudio } from "../../services/AudioService";
import { saveChatHistory } from "../../services/ChatHistoryService";
import { createMessage } from "../../utils/messageBuilder";
import { parseMarkupMessage } from "../../utils/markupParser";
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
	const { audioToggledOn, isChatWindowOpen, setIsBotTyping, setUnreadCount } = useBotStatesContext();

	// handles bot refs
	const { streamMessageMap } = useBotRefsContext();

	// handles rcb events
	const { callRcbEvent } = useRcbEventInternal();

	/**
	 * Simulates the streaming of a message from the bot.
	 * 
	 * @param message message to stream
	 * @param streamSpeed speed to stream the message
	 * @param useMarkup boolean indicating whether markup is used
	 */
	const simulateStream = useCallback(async (message: Message, streamSpeed: number, useMarkup: boolean) => {
		// stop bot typing when simulating stream
		setIsBotTyping(false);

		// set an initial empty message to be used for streaming
		setMessages(prevMessages => [...prevMessages, message]);
		streamMessageMap.current.set("bot", message.id);

		// initialize default message to empty with stream index position 0
		let streamMessage = message.content as string | string[];
		if (useMarkup) {
			streamMessage = parseMarkupMessage(streamMessage as string);
		}
		let streamIndex = 0;
		const endStreamIndex = streamMessage.length;
		message.content = "";

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
						if (updatedMessages[i].sender === message.sender
						&& typeof updatedMessages[i].content === "string") {
							const character = streamMessage[streamIndex];
							if (character) {
								message.content += character;
								updatedMessages[i] = message;
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
		streamMessageMap.current.delete("bot");
		saveChatHistory(messages);
	}, [messages, streamMessageMap]);

	/**
	 * Injects a message at the end of the messages array.
	 * 
	 * @param content message content to inject
	 * @param sender sender of the message, defaults to bot
	 */
	const injectMessage = useCallback(async (content: string | JSX.Element,
		sender = "bot"): Promise<string | null> => {

		let message = createMessage(content, sender);

		// handles pre-message inject event
		if (settings.event?.rcbPreInjectMessage) {
			const event = callRcbEvent(RcbEvent.PRE_INJECT_MESSAGE, {message});
			if (event.defaultPrevented) {
				return null;
			}
			message = event.data.message;
		}

		processAudio(settings, audioToggledOn, isChatWindowOpen, message);
		const isBotStream = typeof message.content === "string"
			&& message.sender === "bot" && settings?.botBubble?.simStream;
		const isUserStream = typeof message.content === "string"
			&& message.sender === "user" && settings?.userBubble?.simStream;

		if (isBotStream) {
			const streamSpeed = settings.botBubble?.streamSpeed as number;
			const useMarkup = settings.botBubble?.dangerouslySetInnerHtml as boolean;
			await simulateStream(message, streamSpeed, useMarkup);
		} else if (isUserStream) {
			const streamSpeed = settings.userBubble?.streamSpeed as number;
			const useMarkup = settings.userBubble?.dangerouslySetInnerHtml as boolean;
			await simulateStream(message, streamSpeed, useMarkup);
		} else {
			setMessages((prevMessages) => [...prevMessages, message]);
		}

		// handles post-message inject event
		setUnreadCount(prev => prev + 1);
		if (settings.event?.rcbPostInjectMessage) {
			callRcbEvent(RcbEvent.POST_INJECT_MESSAGE, {message});
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
			const event = callRcbEvent(RcbEvent.REMOVE_MESSAGE, {message});
			if (event.defaultPrevented) {
				return null;
			}
		}

		setMessages((prevMessages) => prevMessages.filter(message => message.id !== messageId));
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
		sender = "bot"): Promise<string | null> => {

		if (!streamMessageMap.current.has(sender)) {
			const message = createMessage(content, sender);
			// handles start stream message event
			if (settings.event?.rcbStartStreamMessage) {
				const event = callRcbEvent(RcbEvent.START_STREAM_MESSAGE, {message});
				if (event.defaultPrevented) {
					return null;
				}
			}

			setIsBotTyping(false);
			setMessages((prevMessages) => [...prevMessages, message]);
			setUnreadCount(prev => prev + 1);
			streamMessageMap.current.set(sender, message.id);
			return message.id;
		}

		const message = {...createMessage(content, sender), id: streamMessageMap.current.get(sender) as string};
		// handles chunk stream message event
		if (settings.event?.rcbChunkStreamMessage) {
			const event = callRcbEvent(
				RcbEvent.CHUNK_STREAM_MESSAGE,
				{...message, id: streamMessageMap.current.get(sender)}
			);
			if (event.defaultPrevented) {
				return null;
			}
		}

		setMessages((prevMessages) => {
			const updatedMessages = [...prevMessages];

			for (let i = updatedMessages.length - 1; i >= 0; i--) {
				if (updatedMessages[i].sender === sender && typeof updatedMessages[i].content === typeof content) {
					updatedMessages[i] = message;
					break;
				}
			}
		
			return updatedMessages;
		});
		return streamMessageMap.current.get(sender) || null;
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
	const endStreamMessage = useCallback(async (sender = "bot"): Promise<boolean> => {
		// nothing to end if not streaming
		if (!streamMessageMap.current.has(sender)) {
			return true;
		}

		const messageId = streamMessageMap.current.get(sender);
		const messageToEndStreamFor = messages.find((message) => message.id === messageId);

		// handles stop stream message event
		if (settings.event?.rcbStopStreamMessage) {
			const event = callRcbEvent(RcbEvent.STOP_STREAM_MESSAGE, {messageToEndStreamFor});
			if (event.defaultPrevented) {
				return false;
			}
		}

		// remove sender from streaming list and save messages
		streamMessageMap.current.delete(sender);
		saveChatHistory(messages);
		return true;
	}, [callRcbEvent, messages, settings.event?.rcbStopStreamMessage, streamMessageMap])

	return {
		endStreamMessage,
		injectMessage,
		removeMessage,
		streamMessage,
		messages,
		setMessages
	};
};
