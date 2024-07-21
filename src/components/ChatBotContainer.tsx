import { useEffect, useState, useRef, MouseEvent, useMemo, useCallback } from "react";

import ChatBotHeader from "./ChatBotHeader/ChatBotHeader";
import ChatBotBody from "./ChatBotBody/ChatBotBody";
import ChatBotInput from "./ChatBotInput/ChatBotInput";
import ChatBotFooter from "./ChatBotFooter/ChatBotFooter";
import ChatBotButton from "./ChatBotButton/ChatBotButton";
import ChatBotTooltip from "./ChatBotTooltip/ChatBotTooltip";
import ChatHistoryButton from "./ChatHistoryButton/ChatHistoryButton";
import { preProcessBlock, postProcessBlock } from "../services/BlockService/BlockService";
import { processIsSensitive } from "../services/BlockService/IsSensitiveProcessor";
import { loadChatHistory, saveChatHistory, setHistoryStorageValues } from "../services/ChatHistoryService";
import { processAudio } from "../services/AudioService";
import { syncVoiceWithChatInput } from "../services/VoiceService";
import { isChatBotVisible, isDesktop } from "../utils/displayChecker";
import { parseMarkupMessage } from "../utils/markupParser";
import {
	createAudioButton,
	createCloseChatButton,
	createEmojiButton,
	createFileAttachmentButton,
	createNotificationButton,
	createSendButton,
	createVoiceButton,
	getButtonConfig
} from "../utils/buttonBuilder";
import { useBotSettings } from "../context/BotSettingsContext";
import { useBotStyles } from "../context/BotStylesContext";
import { useMessages } from "../context/MessagesContext";
import { usePaths } from "../context/PathsContext";
import { Block } from "../types/Block";
import { Flow } from "../types/Flow";
import { Message } from "../types/Message";
import { BlockParams } from "../types/BlockParams";
import { Button } from "../constants/Button";

import "./ChatBotContainer.css";

/**
 * Integrates and contains the various components that makeup the chatbot.
 * 
 * @param flow conversation flow for the bot
 */
const ChatBotContainer = ({ flow }: { flow: Flow }) => {

	// handles setting of settings for the chat bot
	const { botSettings, setBotSettings } = useBotSettings();

	// handles setting of styles for the chat bot
	const { botStyles } = useBotStyles();

	// handles messages between user and the chat bot
	const { messages, setMessages } = useMessages();

	// handles paths of the user
	const { paths, setPaths } = usePaths();

	// references chat body for auto-scrolling
	const chatBodyRef = useRef<HTMLDivElement>(null);

	// references textarea for user input
	const inputRef = useRef<HTMLTextAreaElement | HTMLInputElement>(null);

	// references a temporarily stored user input for use in attribute params
	const paramsInputRef = useRef<string>("");

	// tracks if chat bot is streaming messages
	const isBotStreamingRef = useRef<boolean>(false);

	// checks if voice should be toggled back on after a user input
	const keepVoiceOnRef = useRef<boolean>(false);

	// audio to play for notifications
	const audioContextRef = useRef<AudioContext | null>(null);
	const audioBufferRef = useRef<AudioBuffer>();
	const gainNodeRef = useRef<AudioNode | null>(null);

	// handles whether attachments are allowed for the current block that user is in
	const [blockAllowsAttachment, setBlockAllowsAttachment] = useState<boolean>(false);

	// tracks if user has interacted with page
	const [hasInteractedPage, setHasInteractedPage] = useState<boolean>(false);

	// tracks if flow has started
	const [hasFlowStarted, setHasFlowStarted] = useState<boolean>(false);

	// tracks if notification is toggled on
	const [notificationToggledOn, setNotificationToggledOn] = useState<boolean>(true);

	// tracks if audio is toggled on
	const [audioToggledOn, setAudioToggledOn] = useState<boolean>(false);

	// tracks if voice is toggled on
	const [voiceToggledOn, setVoiceToggledOn] = useState<boolean>(false);

	// tracks if textarea is disabled
	const [textAreaDisabled, setTextAreaDisabled] = useState<boolean>(true);

	// tracks if textarea is in sensitive mode
	const [textAreaSensitiveMode, setTextAreaSensitiveMode] = useState<boolean>(false);

	// tracks if chat history is being loaded
	const [isLoadingChatHistory, setIsLoadingChatHistory] = useState<boolean>(false);

	// tracks whether user is scrolling chat
	const [isScrolling, setIsScrolling] = useState<boolean>(false);

	// tracks scroll height
	const [chatScrollHeight, setChatScrollHeight] = useState<number>(0);

	// tracks typing state of chat bot
	const [isBotTyping, setIsBotTyping] = useState<boolean>(false);

	// tracks block timeout if transition is interruptable
	const [timeoutId, setTimeoutId] = useState<ReturnType<typeof setTimeout>>();

	// tracks count of unread messages
	const [unreadCount, setUnreadCount] = useState<number>(0);

	// tracks length of input
	const [inputLength, setInputLength] = useState<number>(0);

	// tracks view port height and width (for auto-resizing on mobile view)
	const [viewportHeight, setViewportHeight] = useState<number>(window.visualViewport?.height as number 
		|| window.innerHeight);
	const [viewportWidth, setViewportWidth] = useState<number>(window.visualViewport?.width as number 
		|| window.innerWidth);	

	// tracks previous window scroll position to go back to on mobile
	const scrollPositionRef = useRef<number>(0);

	// buttons to shown in header, chat input and footer
	const [headerButtons, setHeaderButtons] = useState<Array<JSX.Element>>([]);
	const [chatInputButtons, setChatInputButtons] = useState<Array<JSX.Element>>([]);
	const [footerButtons, setFooterButtons] = useState<Array<JSX.Element>>([]);

	// adds listeners and render chat history button if enabled
	useEffect(() => {
		window.addEventListener("click", handleFirstInteraction);
		window.addEventListener("keydown", handleFirstInteraction);
		window.addEventListener("touchstart", handleFirstInteraction);

		setUpNotifications();
		setTextAreaDisabled(botSettings.chatInput?.disabled as boolean);
		setAudioToggledOn(botSettings.audio?.defaultToggledOn as boolean);
		setVoiceToggledOn(botSettings.voice?.defaultToggledOn as boolean);
		if (botSettings.chatHistory?.disabled) {
			localStorage.removeItem(botSettings.chatHistory?.storageKey as string);
		} else {
			const chatHistory = localStorage.getItem(botSettings.chatHistory?.storageKey as string);
			if (chatHistory != null) {
				// note: must always render this button even if autoload (chat history logic relies on system message)
				const messageContent = {
					content: <ChatHistoryButton chatHistory={chatHistory} showChatHistory={showChatHistory} />,
					sender: "system"
				};
				setMessages([messageContent]);
				if (botSettings.chatHistory?.autoLoad) {
					loadChatHistory(botSettings, botStyles, chatHistory, setMessages, setTextAreaDisabled);
				}
			}
		}

		return () => {
			window.removeEventListener("click", handleFirstInteraction);
			window.removeEventListener("keydown", handleFirstInteraction);
			window.removeEventListener("touchstart", handleFirstInteraction);
		};
	}, []);

	// triggers update to chat history options
	useEffect(() => {
		setHistoryStorageValues(botSettings);
	}, [botSettings.chatHistory?.storageKey, botSettings.chatHistory?.maxEntries, botSettings.chatHistory?.disabled]);

	// used to handle virtualkeyboard api (if supported on browser)
	useEffect(() => {
		// if is desktop or is embedded bot, nothing to resize
		if (isDesktop || botSettings.general?.embedded) {
			return;
		}
		
		if (navigator.virtualKeyboard) {
			navigator.virtualKeyboard.overlaysContent = true;
			navigator.virtualKeyboard.addEventListener("geometrychange", (event) => {
				if (!event.target) {
					return;
				}

				const { x, y, width, height } = (event.target as VirtualKeyboard).boundingRect;
				// width does not need adjustments so only height is adjusted
				if (x == 0 && y == 0 && width == 0 && height == 0) {
					// delay added as it takes time for keyboard to appear and resize the viewport height
					setTimeout(() => {
						setViewportHeight(window.visualViewport?.height as number);
					}, 101);

					// a second check added in case device lags and needs a later resizing
					setTimeout(() => {
						if (viewportHeight != window.visualViewport?.height as number) {
							setViewportHeight(window.visualViewport?.height as number);
						}
					}, 1001);
				} else {
					// delay added as it takes time for keyboard to disappear and resize the viewport height
					setTimeout(() => {
						setViewportHeight(window.visualViewport?.height as number - height);
					}, 101);
				}
			});
		}
	}, [])

	// triggers check for notifications and saving of chat history
	useEffect(() => {
		saveChatHistory(messages);
		handleNotifications();
	}, [messages.length]);

	// saves messages once a stream ends
	useEffect(() => {
		if (!isBotStreamingRef.current) {
			saveChatHistory(messages);
		}
	}, [isBotStreamingRef.current])

	// resets unread count on opening chat and handles scrolling/resizing window on mobile devices
	useEffect(() => {
		if (botSettings.isOpen) {
			setUnreadCount(0);
			setViewportHeight(window.visualViewport?.height as number);
			setViewportWidth(window.visualViewport?.width as number);
		}

		if (isDesktop) {
			return;
		}

		// handles scrolling of window when chat is open (only for mobile view).
		const handleMobileScrollOpened = () => window.scrollTo({top: 0, left: 0, behavior: "auto"});
		// handles scrolling of window when chat is closed (only for mobile view).
		const handleMobileScrollClosed = () => scrollPositionRef.current = window.scrollY;
		const handleResize = () => {
			setViewportHeight(window.visualViewport?.height as number);
			setViewportWidth(window.visualViewport?.width as number);
		}

		const cleanupScrollEventListeners = () => {
			window.removeEventListener("scroll", handleMobileScrollOpened);
			window.removeEventListener("scroll", handleMobileScrollClosed);
			window.visualViewport?.removeEventListener("resize", handleResize);
		};

		if (botSettings.isOpen) {
			cleanupScrollEventListeners();
			document.body.style.position = "fixed";
			window.addEventListener("scroll", handleMobileScrollOpened);
			window.visualViewport?.addEventListener("resize", handleResize);
		} else {
			document.body.style.position = "static";
			cleanupScrollEventListeners();
			window.scrollTo({top: scrollPositionRef.current, left: 0, behavior: "auto"});
			window.addEventListener("scroll", handleMobileScrollClosed);
			window.visualViewport?.removeEventListener("resize", handleResize);
		}

		return cleanupScrollEventListeners;
	}, [botSettings.isOpen]);

	// performs pre-processing when paths change
	useEffect(() => {
		const currPath = getCurrPath();
		if (!currPath) {
			return;
		}
		const block = flow[currPath];

		// if path is invalid, nothing to process (i.e. becomes dead end!)
		if (!block) {
			setIsBotTyping(false);
			return;
		}

		const params = {prevPath: getPrevPath(), goToPath: goToPath, userInput: paramsInputRef.current,
			injectMessage, streamMessage, openChat};

		// calls the new block for preprocessing upon change to path.
		const callNewBlock = async (currPath: keyof Flow, block: Block, params: BlockParams) => {
			await preProcessBlock(flow, currPath, params, setTextAreaDisabled, setTextAreaSensitiveMode,
				setPaths, setTimeoutId, handleActionInput);

			// cleanup logic after preprocessing of a block
			setIsBotTyping(false);
			if (!block.chatDisabled) {
				setTextAreaDisabled(botSettings.chatInput?.disabled as boolean);
			}
			setBlockAllowsAttachment(typeof block.file === "function");
			updateTextAreaFocus(currPath);
			syncVoiceWithChatInput(keepVoiceOnRef.current && !block.chatDisabled, botSettings);

			// cleanup logic after preprocessing of a block (affects only streaming messages)
			isBotStreamingRef.current = false
		}

		callNewBlock(currPath, block, params);
	}, [paths]);

	useEffect(() => {
		if (hasFlowStarted || botSettings.general?.flowStartTrigger === "ON_LOAD") {
			setPaths(["start"]);
		}
	}, [hasFlowStarted]);

	/**
	 * Sets up the notifications feature (initial toggle status and sound).
	 */
	const setUpNotifications = useCallback(async () => {
		setNotificationToggledOn(botSettings.notification?.defaultToggledOn as boolean);
	
		const notificationSound = botSettings.notification?.sound;
		audioContextRef.current = new AudioContext();
		const gainNode = audioContextRef.current.createGain();
		gainNode.gain.value = botSettings.notification?.volume || 0.2;
		gainNodeRef.current = gainNode;

		let audioSource;
		if (notificationSound?.startsWith("data:audio")) {
			const binaryString = atob(notificationSound.split(",")[1]);
			const arrayBuffer = new ArrayBuffer(binaryString.length);
			const uint8Array = new Uint8Array(arrayBuffer);
			for (let i = 0; i < binaryString.length; i++) {
				uint8Array[i] = binaryString.charCodeAt(i);
			}
			audioSource = arrayBuffer;
		} else {
			const response = await fetch(notificationSound as string);
			audioSource = await response.arrayBuffer();
		}

		audioBufferRef.current = await audioContextRef.current.decodeAudioData(audioSource);
	}, [botSettings.notification?.defaultToggledOn, botSettings.notification?.sound, botSettings.notification?.volume]);

	/**
	 * Checks for initial user interaction (required to play audio/notification sound).
	 */
	const handleFirstInteraction = useCallback(() => {
		setHasInteractedPage(true);
		if (!hasFlowStarted && botSettings.general?.flowStartTrigger === "ON_PAGE_INTERACT") {
			setHasFlowStarted(true);
		}

		// workaround for getting audio to play on mobile
		const utterance = new SpeechSynthesisUtterance();
		utterance.text = "";
		utterance.onend = () => {
			window.removeEventListener("click", handleFirstInteraction);
			window.removeEventListener("keydown", handleFirstInteraction);
			window.removeEventListener("touchstart", handleFirstInteraction);
		};
		window.speechSynthesis.speak(utterance);
	}, [botSettings.general?.flowStartTrigger, hasFlowStarted]);

	/**
	 * Modifies botoptions to open/close the chat window.
	 * 
	 * @param isOpen boolean indicating whether to open/close the chat window
	 */
	const openChat = useCallback((isOpen: boolean) => {
		setBotSettings({...botSettings, isOpen});
	}, [botSettings, setBotSettings]);

	/**
	 * Handles notification count update and notification sound.
	 */
	const handleNotifications = useCallback(() => {
		// if no audio context or no messages, return
		if (!audioContextRef.current || messages.length === 0) {
			return;
		}

		const message = messages[messages.length - 1]
		// if message is null or sent by user or is bot typing or bot is embedded, return
		if (!message || message.sender === "user" || isBotTyping || (botSettings.general?.embedded
			&& isChatBotVisible(chatBodyRef.current as HTMLDivElement))) {
			return;
		}

		// if chat is open but user is not scrolling, return
		if (botSettings.isOpen && !isScrolling) {
			return;
		}

		setUnreadCount(prev => prev + 1);
		if (!botSettings.notification?.disabled && notificationToggledOn
			&& hasInteractedPage && audioBufferRef.current) {
			const source = audioContextRef.current.createBufferSource();
			source.buffer = audioBufferRef.current;
			source.connect(gainNodeRef.current as AudioNode).connect(audioContextRef.current.destination);
			source.start();
		}
	}, [botSettings, messages, isBotTyping, isScrolling, notificationToggledOn, hasInteractedPage]);

	/**
	 * Retrieves current path for user.
	 */
	const getCurrPath = useCallback(() => {
		return paths.length > 0 ? paths[paths.length - 1] : null;
	}, [paths])

	/**
	 * Retrieves previous path for user.
	 */
	const getPrevPath = useCallback(() => {
		return paths.length > 1 ? paths[paths.length - 2] : null;
	}, [paths])

	/**
	 * Handles going directly to a path.
	 */
	const goToPath = useCallback((pathToGo: keyof Flow) => {
		setPaths(prev => [...prev, pathToGo]);
	}, [])

	/**
	 * Injects a message at the end of the messages array.
	 * 
	 * @param content message content to inject
	 * @param sender sender of the message, defaults to bot
	 */
	const injectMessage = useCallback(async (content: string | JSX.Element, sender = "bot") => {
		const message = {content: content, sender: sender};
		processAudio(botSettings, audioToggledOn, message);

		const isBotStream = typeof message.content === "string"
			&& message.sender === "bot" && botSettings?.botBubble?.simStream;
		const isUserStream = typeof message.content === "string"
			&& message.sender === "user" && botSettings?.userBubble?.simStream;

		if (isBotStream) {
			const streamSpeed = botSettings.botBubble?.streamSpeed as number;
			const useMarkup = botSettings.botBubble?.dangerouslySetInnerHtml as boolean;
			await simulateStream(message, streamSpeed, useMarkup);
		} else if (isUserStream) {
			const streamSpeed = botSettings.userBubble?.streamSpeed as number;
			const useMarkup = botSettings.userBubble?.dangerouslySetInnerHtml as boolean;
			await simulateStream(message, streamSpeed, useMarkup);
		} else {
			setMessages((prevMessages) => [...prevMessages, message]);
		}
	}, [botSettings, audioToggledOn]);

	/**
	 * Simulates the streaming of a message from the bot.
	 * 
	 * @param message message to stream
	 * @param streamSpeed speed to stream the message
	 * @param useMarkup boolean indicating whether markup is used
	 */
	const simulateStream = async (message: Message, streamSpeed: number, useMarkup: boolean) => {
		// stop bot typing when simulating stream
		setIsBotTyping(false);

		// set an initial empty message to be used for streaming
		setMessages(prevMessages => [...prevMessages, message]);
		isBotStreamingRef.current = true

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
		isBotStreamingRef.current = false;
	};

	/**
	 *  Streams data into the last message at the end of the messages array with given type.
	 * 
	 * @param content message content to inject
	 * @param sender sender of the message, defaults to bot
	 */
	const streamMessage = useCallback(async (content: string | JSX.Element, sender = "bot") => {
		const message = {content: content, sender: sender};

		// if has no stream yet, add an initial message and set streaming to true
		if (!isBotStreamingRef.current) {
			setIsBotTyping(false);
			setMessages(prevMessages => [...prevMessages, message]);
			isBotStreamingRef.current = true;
			return;
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
	}, [])

	/**
	 * Loads and shows chat history in the chat window.
	 * 
	 * @param chatHistory chat history content to show
	 */
	const showChatHistory = useCallback((chatHistory: string) => {
		setIsLoadingChatHistory(true);
		setTextAreaDisabled(true);
		loadChatHistory(botSettings, botStyles, chatHistory, setMessages, setTextAreaDisabled);
	}, [botSettings]);

	/**
	 * Updates text area focus based on current block's text area.
	 */
	const updateTextAreaFocus = useCallback((currPath: string) => {
		if (!textAreaDisabled) {
			setTimeout(() => {
				if (botSettings.general?.embedded) {
					// for embedded chatbot, only do input focus if chatbot is still visible on page
					if (isChatBotVisible(chatBodyRef.current as HTMLDivElement)) {
						inputRef.current?.focus();
					}
				} else {
					// prevent chatbot from forcing input focus on load
					if (currPath !== "start") {
						inputRef.current?.focus();
					}
				}
			}, 100)
		}
	}, [textAreaDisabled]);

	/**
	 * Handles toggling of voice.
	 * 
	 * @param event mouse event
	 */
	const handleToggleVoice = useCallback(() => {
		if (textAreaDisabled) {
			return;
		}
		setVoiceToggledOn(prev => !prev);
	}, [textAreaDisabled]);

	/**
	 * Handles action input from the user which includes text, files and emoji.
	 * 
	 * @param path path to process input with
	 * @param userInput input provided by the user
	 * @param sendUserInput boolean indicating if user input should be sent as a message into the chat window
	 */
	const handleActionInput = useCallback(async (path: keyof Flow, userInput: string, sendUserInput = true) => {
		clearTimeout(timeoutId);
		userInput = userInput.trim();
		paramsInputRef.current = userInput;

		if (userInput === "") {
			return;
		}

		// Add user message to messages array
		if (sendUserInput) {
			await handleSendUserInput(userInput);
		}

		if (chatBodyRef.current) {
			chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
		}


		// Clear input field
		if (inputRef.current) {
			inputRef.current.value = "";
		}

		if (botSettings.chatInput?.blockSpam) {
			setTextAreaDisabled(true);
		}

		// used for voice
		keepVoiceOnRef.current = voiceToggledOn;
		syncVoiceWithChatInput(false, botSettings);
		
		setTimeout(() => {
			setIsBotTyping(true);
		}, 400);

		setTimeout(async () => {
			const params = {prevPath: getPrevPath(), goToPath: goToPath, userInput, 
				injectMessage, streamMessage,openChat
			};
			const hasNextPath = await postProcessBlock(flow, path, params, setPaths);
			if (!hasNextPath) {
				const currPath = getCurrPath();
				if (!currPath) {
					return;
				}

				const block = flow[currPath];
				if (!block) {
					return;
				}
				if (!block.chatDisabled) {
					setTextAreaDisabled(botSettings.chatInput?.disabled as boolean);
				}
				processIsSensitive(block, setTextAreaSensitiveMode, params);
				setBlockAllowsAttachment(typeof block.file === "function");
				syncVoiceWithChatInput(keepVoiceOnRef.current, botSettings);
				setIsBotTyping(false);
			}
		}, botSettings.chatInput?.botDelay);
	}, [timeoutId, voiceToggledOn, botSettings, flow, getPrevPath, injectMessage, streamMessage, openChat,
		postProcessBlock, setPaths, updateTextAreaFocus
	]);

	/**
	 * Handles sending of user input to check if should send as plain text or sensitive info.
	 * 
	 * @param userInput input provided by the user
	 */
	const handleSendUserInput = useCallback(async (userInput: string) => {
		const currPath = getCurrPath();
		if (!currPath) {
			return;
		}

		const block = flow[currPath];
		if (!block) {
			return;
		}

		if (textAreaSensitiveMode) {
			if (botSettings?.sensitiveInput?.hideInUserBubble) {
				return;
			} else if (botSettings?.sensitiveInput?.maskInUserBubble) {
				await injectMessage("*".repeat(botSettings.sensitiveInput?.asterisksCount as number || 10), "user");
				return;
			}
		}

		await injectMessage(userInput, "user");
	}, [flow, getCurrPath, botSettings, injectMessage, textAreaSensitiveMode]);

	/**
	 * Handles submission of user input via enter key or send button.
	 * 
	 * @param event form event or mouse event
	 */
	const handleSubmit = useCallback(() => {
		const currPath = getCurrPath();
		if (!currPath) {
			return;
		}
		handleActionInput(currPath, inputRef.current?.value as string);
		setInputLength(0);
	}, [getCurrPath, handleActionInput, setInputLength])

	/**
	 * Retrieves class name for window state.
	 */
	const getWindowStateClass = () => {
		const windowClass = "rcb-chat-bot ";
		if (botSettings.general?.embedded) {
			return windowClass + "rcb-window-embedded";
		} else if (botSettings.isOpen) {
			return windowClass + "rcb-window-open";
		} else {
			return windowClass + "rcb-window-close"
		}
	}

	/**
	 * Retrieves styles for chat window.
	 */
	const getChatWindowStyle = () => {
		if (!isDesktop && !botSettings.general?.embedded) {
			return {
				...botStyles.chatWindowStyle,
				borderRadius: "0px",
				left: "0px",
				right: "auto",
				top: "0px",
				bottom: "auto",
				width: `${viewportWidth}px`,
				height: `${viewportHeight}px`,
			}
		} else {
			return botStyles.chatWindowStyle;
		}
	}

	// these hooks handle the rendering of buttons
	const staticButtonComponentMap = useMemo(() => ({
		[Button.CLOSE_CHAT_BUTTON]: () => createCloseChatButton()
	}), []);

	const sendButtonComponentMap = useMemo(() => ({
		[Button.SEND_MESSAGE_BUTTON]: () => createSendButton(handleSubmit)
	}), [handleSubmit]);
	
	const audioButtonComponentMap = useMemo(() => ({
		[Button.AUDIO_BUTTON]: () => createAudioButton(audioToggledOn, setAudioToggledOn)
	}), [audioToggledOn]);
	
	const notificationButtonComponentMap = useMemo(() => ({
		[Button.NOTIFICATION_BUTTON]: () => createNotificationButton(notificationToggledOn, setNotificationToggledOn)
	}), [notificationToggledOn]);
	
	const inputButtonComponentMap = useMemo(() => ({
		[Button.EMOJI_PICKER_BUTTON]: () => createEmojiButton(inputRef, textAreaDisabled),
		[Button.VOICE_MESSAGE_BUTTON]: () => createVoiceButton(inputRef, textAreaDisabled, voiceToggledOn,
			handleToggleVoice, getCurrPath, handleActionInput, injectMessage, setInputLength
		)
	}), [inputRef, textAreaDisabled, voiceToggledOn, handleToggleVoice, getCurrPath, handleActionInput,
		injectMessage, setInputLength
	]);
	
	const fileAttachmentButtonComponentMap = useMemo(() => ({
		[Button.FILE_ATTACHMENT_BUTTON]: () => createFileAttachmentButton(inputRef, flow, blockAllowsAttachment,
			injectMessage, streamMessage, openChat, getCurrPath, getPrevPath, goToPath, handleActionInput
		)
	}), [inputRef, flow, blockAllowsAttachment, injectMessage, streamMessage, openChat,
		getCurrPath, getPrevPath, goToPath, handleActionInput
	]);
	
	const buttonComponentMap = useMemo(() => ({
		...staticButtonComponentMap,
		...sendButtonComponentMap,
		...audioButtonComponentMap,
		...notificationButtonComponentMap,
		...inputButtonComponentMap,
		...fileAttachmentButtonComponentMap
	}), [staticButtonComponentMap, audioButtonComponentMap, notificationButtonComponentMap,
		inputButtonComponentMap, fileAttachmentButtonComponentMap
	]);
	
	useEffect(() => {
		const buttonConfig = getButtonConfig(botSettings, buttonComponentMap);
		setHeaderButtons(buttonConfig.header);
		setChatInputButtons(buttonConfig.chatInput);
		setFooterButtons(buttonConfig.footer);
	}, [botSettings, buttonComponentMap]);

	return (
		<div 
			onMouseDown={(event: MouseEvent) => {
				// checks if user is interacting with chatbot for the first time
				if (!hasFlowStarted && botSettings.general?.flowStartTrigger === "ON_CHATBOT_INTERACT") {
					setHasFlowStarted(true);
				}

				// if not on mobile, should remove focus
				if (isDesktop) {
					inputRef.current?.blur();
				} else {
					event?.preventDefault();
				}
			}}
			className={getWindowStateClass()}
		>
			<ChatBotTooltip/>
			<ChatBotButton unreadCount={unreadCount}/>
			{/* styles and prevents background from scrolling on mobile when chat window is open */}
			{botSettings.isOpen && !isDesktop && !botSettings.general?.embedded &&
				<>
					<style>
						{`
							html {
								overflow: hidden !important;
								touch-action: none !important;
								scroll-behavior: auto !important;
							}
						`}
					</style>
					<div 
						style={{
							position: "fixed",
							top: 0,
							left: 0,
							width: "100%",
							height: "100%",
							backgroundColor: "#fff",
							zIndex: 9999
						}}
					>	
					</div>
				</>
			}
			<div
				style={getChatWindowStyle()}
				className="rcb-chat-window"
			>
				{botSettings.general?.showHeader &&
					<ChatBotHeader buttons={headerButtons}/>
				}
				<ChatBotBody chatBodyRef={chatBodyRef} isBotTyping={isBotTyping}
					isLoadingChatHistory={isLoadingChatHistory} chatScrollHeight={chatScrollHeight}
					setChatScrollHeight={setChatScrollHeight} setIsLoadingChatHistory={setIsLoadingChatHistory}
					isScrolling={isScrolling} setIsScrolling={setIsScrolling}
					unreadCount={unreadCount} setUnreadCount={setUnreadCount}
				/>
				{botSettings.general?.showInputRow &&
					<ChatBotInput
						inputRef={inputRef} textAreaDisabled={textAreaDisabled}
						textAreaSensitiveMode={textAreaSensitiveMode} inputLength={inputLength}
						setInputLength={setInputLength} handleSubmit={handleSubmit}
						hasFlowStarted={hasFlowStarted} setHasFlowStarted={setHasFlowStarted} buttons={chatInputButtons}
					/>
				}
				{botSettings.general?.showFooter &&
					<ChatBotFooter buttons={footerButtons}/>
				}
			</div>
		</div>
	);
};

export default ChatBotContainer;