import { useEffect, useState, useRef, MouseEvent } from "react";

import ChatBotHeader from "./ChatBotHeader/ChatBotHeader";
import ChatBotBody from "./ChatBotBody/ChatBotBody";
import ChatBotInput from "./ChatBotInput/ChatBotInput";
import ChatBotFooter from "./ChatBotFooter/ChatBotFooter";
import ChatBotButton from "./ChatBotButton/ChatBotButton";
import ChatBotTooltip from "./ChatBotTooltip/ChatBotTooltip";
import ChatHistoryButton from "./ChatHistoryButton/ChatHistoryButton";
import { preProcessBlock, postProcessBlock } from "../services/BlockService/BlockService";
import { loadChatHistory, saveChatHistory, setHistoryStorageValues } from "../services/ChatHistoryService";
import { processAudio } from "../services/AudioService";
import { syncVoiceWithChatInput } from "../services/VoiceService";
import { isChatBotVisible, isDesktop, parseMarkupMessage } from "../services/Utils";
import { useBotOptions } from "../context/BotOptionsContext";
import { useMessages } from "../context/MessagesContext";
import { usePaths } from "../context/PathsContext";
import { Block } from "../types/Block";
import { Flow } from "../types/Flow";
import { Message } from "../types/Message";
import { Params } from "../types/Params";

import "./ChatBotContainer.css";

/**
 * Integrates and contains the various components that makeup the chatbot.
 * 
 * @param flow conversation flow for the bot
 */
const ChatBotContainer = ({ flow }: { flow: Flow }) => {

	// handles setting of options for the chat bot
	const { botOptions, setBotOptions } = useBotOptions();

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
	const [textAreaDisabled, setTextAreaDisabled] = useState<boolean>(false);

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

	// tracks view port height and width (for auto-resizing on mobile view)
	const [viewportHeight, setViewportHeight] = useState<number>(window.visualViewport?.height as number 
		|| window.innerHeight);
	const [viewportWidth, setViewportWidth] = useState<number>(window.visualViewport?.width as number 
		|| window.innerWidth);	

	// tracks previous window scroll position to go back to on mobile
	const scrollPositionRef = useRef<number>(0);

	// adds listeners and render chat history button if enabled
	useEffect(() => {
		window.addEventListener("click", handleFirstInteraction);
		window.addEventListener("keydown", handleFirstInteraction);
		window.addEventListener("touchstart", handleFirstInteraction);

		setUpNotifications();
		setTextAreaDisabled(botOptions.chatInput?.disabled as boolean);
		setAudioToggledOn(botOptions.audio?.defaultToggledOn as boolean);
		setVoiceToggledOn(botOptions.voice?.defaultToggledOn as boolean);
		if (botOptions.chatHistory?.disabled) {
			localStorage.removeItem(botOptions.chatHistory?.storageKey as string);
		} else {
			const chatHistory = localStorage.getItem(botOptions.chatHistory?.storageKey as string);
			if (chatHistory != null) {
				// note: must always render this button even if autoload (chat history logic relies on system message)
				const messageContent = {
					content: <ChatHistoryButton chatHistory={chatHistory} showChatHistory={showChatHistory} />,
					sender: "system"
				};
				setMessages([messageContent]);
				if (botOptions.chatHistory?.autoLoad) {
					loadChatHistory(botOptions, chatHistory, setMessages, setTextAreaDisabled);
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
		setHistoryStorageValues(botOptions);
	}, [botOptions.chatHistory?.storageKey, botOptions.chatHistory?.maxEntries, botOptions.chatHistory?.disabled]);

	// used to handle virtualkeyboard api (if supported on browser)
	useEffect(() => {
		// if is desktop or is embedded bot, nothing to resize
		if (isDesktop || botOptions.theme?.embedded) {
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
		if (botOptions.isOpen) {
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

		if (botOptions.isOpen) {
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
	}, [botOptions.isOpen]);

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

		const params = {prevPath: getPrevPath(), userInput: paramsInputRef.current,
			injectMessage, streamMessage, openChat};
		callNewBlock(currPath, block, params);
	}, [paths]);

	useEffect(() => {
		if (hasFlowStarted || botOptions.theme?.flowStartTrigger === "ON_LOAD") {
			setPaths(["start"]);
		}
	}, [hasFlowStarted]);

	/**
	 * Calls the new block for preprocessing upon change to path.
	 * 
	 * @param currPath the current path
	 * @param block the current block
	 * @param params parameters that may be used in the block
	 */
	const callNewBlock = async (currPath: keyof Flow, block: Block, params: Params) => {
		// when bot first loads, disable textarea first to allow uninterrupted sending of initial messages
		if (currPath === "start") {
			setTextAreaDisabled(true);
		}

		await preProcessBlock(flow, currPath, params, setTextAreaDisabled, setTextAreaSensitiveMode,
			setPaths, setTimeoutId, handleActionInput);

		// cleanup logic after preprocessing of a block
		setIsBotTyping(false);
		updateTextArea();
		syncVoiceWithChatInput(keepVoiceOnRef.current && !block.chatDisabled, botOptions);

		// cleanup logic after preprocessing of a block (affects only streaming messages)
		isBotStreamingRef.current = false
	}

	/**
	 * Sets up the notifications feature (initial toggle status and sound).
	 */
	const setUpNotifications = async () => {
		setNotificationToggledOn(botOptions.notification?.defaultToggledOn as boolean);
	
		const notificationSound = botOptions.notification?.sound;
		audioContextRef.current = new AudioContext();
		const gainNode = audioContextRef.current.createGain();
		gainNode.gain.value = botOptions.notification?.volume || 0.2;
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
	}

	/**
	 * Checks for initial user interaction (required to play audio/notification sound).
	 */
	const handleFirstInteraction = () => {
		setHasInteractedPage(true);
		if (!hasFlowStarted && botOptions.theme?.flowStartTrigger === "ON_PAGE_INTERACT") {
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
	};

	/**
	 * Modifies botoptions to open/close the chat window.
	 * 
	 * @param isOpen boolean indicating whether to open/close the chat window
	 */
	const openChat = (isOpen: boolean) => {
		setBotOptions({...botOptions, isOpen});
	}

	/**
	 * Handles notification count update and notification sound.
	 */
	const handleNotifications = () => {
		// if no audio context or no messages, return
		if (!audioContextRef.current || messages.length === 0) {
			return;
		}

		const message = messages[messages.length - 1]
		// if message is null or sent by user or is bot typing or bot is embedded, return
		if (!message || message.sender === "user" || isBotTyping || (botOptions.theme?.embedded
			&& isChatBotVisible(chatBodyRef.current as HTMLDivElement))) {
			return;
		}

		// if chat is open but user is not scrolling, return
		if (botOptions.isOpen && !isScrolling) {
			return;
		}

		setUnreadCount(prev => prev + 1);
		if (!botOptions.notification?.disabled && notificationToggledOn
			&& hasInteractedPage && audioBufferRef.current) {
			const source = audioContextRef.current.createBufferSource();
			source.buffer = audioBufferRef.current;
			source.connect(gainNodeRef.current as AudioNode).connect(audioContextRef.current.destination);
			source.start();
		}
	}

	/**
	 * Retrieves current path for user.
	 */
	const getCurrPath = () => {
		return paths.length > 0 ? paths[paths.length - 1] : null;
	}

	/**
	 * Retrieves previous path for user.
	 */
	const getPrevPath = () => {
		return paths.length > 1 ? paths[paths.length - 2] : null;
	}

	/**
	 * Injects a message at the end of the messages array.
	 * 
	 * @param content message content to inject
	 * @param sender sender of the message, defaults to bot
	 */
	const injectMessage = async (content: string | JSX.Element, sender = "bot") => {
		const message = {content: content, sender: sender};
		processAudio(botOptions, audioToggledOn, message);

		const isBotStream = typeof message.content === "string"
			&& message.sender === "bot" && botOptions?.botBubble?.simStream;
		const isUserStream = typeof message.content === "string"
			&& message.sender === "user" && botOptions?.userBubble?.simStream;

		if (isBotStream) {
			const streamSpeed = botOptions.botBubble?.streamSpeed as number;
			const useMarkup = botOptions.botBubble?.dangerouslySetInnerHtml as boolean;
			await simulateStream(message, streamSpeed, useMarkup);
		} else if (isUserStream) {
			const streamSpeed = botOptions.userBubble?.streamSpeed as number;
			const useMarkup = botOptions.userBubble?.dangerouslySetInnerHtml as boolean;
			await simulateStream(message, streamSpeed, useMarkup);
		} else {
			setMessages((prevMessages) => [...prevMessages, message]);
		}
	}

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
	const streamMessage = async (content: string | JSX.Element, sender = "bot") => {
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
	}

	/**
	 * Loads and shows chat history in the chat window.
	 * 
	 * @param chatHistory chat history content to show
	 */
	const showChatHistory = (chatHistory: string) => {
		setIsLoadingChatHistory(true);
		setTextAreaDisabled(true);
		loadChatHistory(botOptions, chatHistory, setMessages, setTextAreaDisabled);
	}

	/**
	 * Updates textarea disabled state based on current block.
	 */
	const updateTextArea = () => {
		const currPath = getCurrPath();
		if (!currPath) {
			return;
		}
		const block = flow[currPath];

		if (!block) {
			return;
		}

		const shouldDisableTextArea = block.chatDisabled 
			? block.chatDisabled
			: botOptions.chatInput?.disabled as boolean;
		setTextAreaDisabled(shouldDisableTextArea);

		if (!shouldDisableTextArea) {
			setTimeout(() => {
				if (botOptions.theme?.embedded) {
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

		if (block.isSensitive) {
			setTextAreaSensitiveMode(block.isSensitive);
		} else {
			setTextAreaSensitiveMode(false);
		}
	}

	/**
	 * Handles toggling of notification.
	 * 
	 * @param event mouse event
	 */
	const handleToggleNotification = () => {
		setNotificationToggledOn(prev => !prev);
	}

	/**
	 * Handles toggling of audio.
	 * 
	 * @param event mouse event
	 */
	const handleToggleAudio = () => {
		setAudioToggledOn(prev => !prev);
	}

	/**
	 * Handles toggling of voice.
	 * 
	 * @param event mouse event
	 */
	const handleToggleVoice = () => {
		if (textAreaDisabled) {
			return;
		}
		setVoiceToggledOn(prev => !prev);
	}

	/**
	 * Handles action input from the user which includes text, files and emoji.
	 * 
	 * @param path path to process input with
	 * @param userInput input provided by the user
	 * @param sendUserInput boolean indicating if user input should be sent as a message into the chat window
	 */
	const handleActionInput = async (path: keyof Flow, userInput: string, sendUserInput = true) => {
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

		if (botOptions.chatInput?.blockSpam) {
			setTextAreaDisabled(true);
		}

		// used for voice
		keepVoiceOnRef.current = voiceToggledOn;
		syncVoiceWithChatInput(false, botOptions);
		
		setTimeout(() => {
			setIsBotTyping(true);
		}, 400);

		setTimeout(async () => {
			const params = {prevPath: getPrevPath(), userInput, injectMessage, streamMessage, openChat};
			const hasNextPath = await postProcessBlock(flow, path, params, setPaths);
			if (!hasNextPath) {
				updateTextArea();
				syncVoiceWithChatInput(keepVoiceOnRef.current, botOptions);
				setIsBotTyping(false);
			}
		}, botOptions.chatInput?.botDelay);
	}

	/**
	 * Handles sending of user input to check if should send as plain text or sensitive info.
	 * 
	* @param userInput input provided by the user
	 */
	const handleSendUserInput = async (userInput: string) => {
		const currPath = getCurrPath();
		if (!currPath) {
			return;
		}

		const block = flow[currPath];
		if (!block) {
			return;
		}

		if (block.isSensitive) {
			if (botOptions?.sensitiveInput?.hideInUserBubble) {
				return;
			} else if (botOptions?.sensitiveInput?.maskInUserBubble) {
				await injectMessage("*".repeat(botOptions.sensitiveInput?.asterisksCount as number || 10), "user");
				return;
			}
		}

		await injectMessage(userInput, "user");
	}

	/**
	 * Retrieves class name for window state.
	 */
	const getWindowStateClass = () => {
		const windowClass = "rcb-chat-bot ";
		if (botOptions.theme?.embedded) {
			return windowClass + "rcb-window-embedded";
		} else if (botOptions.isOpen) {
			return windowClass + "rcb-window-open";
		} else {
			return windowClass + "rcb-window-close"
		}
	}

	/**
	 * Retrieves styles for chat window.
	 */
	const getChatWindowStyle = () => {
		if (!isDesktop && !botOptions.theme?.embedded) {
			return {
				...botOptions.chatWindowStyle,
				borderRadius: "0px",
				left: "0px",
				right: "auto",
				top: "0px",
				bottom: "auto",
				width: `${viewportWidth}px`,
				height: `${viewportHeight}px`,
			}
		} else {
			return botOptions.chatWindowStyle;
		}
	}

	return (
		<div 
			onMouseDown={(event: MouseEvent) => {
				// checks if user is interacting with chatbot for the first time
				if (!hasFlowStarted && botOptions.theme?.flowStartTrigger === "ON_CHATBOT_INTERACT") {
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
			{botOptions.isOpen && !isDesktop && !botOptions.theme?.embedded &&
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
				{botOptions.theme?.showHeader &&
					<ChatBotHeader notificationToggledOn={notificationToggledOn} 
						handleToggleNotification={handleToggleNotification}
						audioToggledOn={audioToggledOn} handleToggleAudio={handleToggleAudio}
					/>
				}
				<ChatBotBody chatBodyRef={chatBodyRef} isBotTyping={isBotTyping}
					isLoadingChatHistory={isLoadingChatHistory} chatScrollHeight={chatScrollHeight}
					setChatScrollHeight={setChatScrollHeight} setIsLoadingChatHistory={setIsLoadingChatHistory}
					isScrolling={isScrolling} setIsScrolling={setIsScrolling}
					unreadCount={unreadCount} setUnreadCount={setUnreadCount}
				/>
				{botOptions.theme?.showInputRow &&
					<ChatBotInput handleToggleVoice={handleToggleVoice} handleActionInput={handleActionInput} 
						inputRef={inputRef} textAreaDisabled={textAreaDisabled}
						textAreaSensitiveMode={textAreaSensitiveMode} injectMessage={injectMessage}
						voiceToggledOn={voiceToggledOn} getCurrPath={getCurrPath}
						hasFlowStarted={hasFlowStarted} setHasFlowStarted={setHasFlowStarted}
					/>
				}
				{botOptions.theme?.showFooter &&
					<ChatBotFooter inputRef={inputRef} flow={flow} textAreaDisabled={textAreaDisabled} 
						handleActionInput={handleActionInput} injectMessage={injectMessage}
						streamMessage={streamMessage} getCurrPath={getCurrPath} getPrevPath={getPrevPath}
						openChat={openChat}
					/>
				}
			</div>
		</div>
	);
};

export default ChatBotContainer;