import { useEffect, useState, useRef, MouseEvent } from "react";

import ChatBotHeader from "./ChatBotHeader/ChatBotHeader";
import ChatBotBody from "./ChatBotBody/ChatBotBody";
import ChatBotInput from "./ChatBotInput/ChatBotInput";
import ChatBotFooter from "./ChatBotFooter/ChatBotFooter";
import ChatBotButton from "./ChatBotButton/ChatBotButton";
import ChatHistoryButton from "./ChatHistoryButton/ChatHistoryButton";
import ChatBotTooltip from "./ChatBotTooltip/ChatBotTooltip";
import { preProcessBlock, postProcessBlock } from "../services/BlockService/BlockService";
import { updateMessages, loadChatHistory } from "../services/ChatHistoryService";
import { processAudio } from "../services/AudioService";
import { syncVoiceWithChatInput } from "../services/VoiceService";
import { isDesktop } from "../services/Utils";
import { useBotOptions } from "../context/BotOptionsContext";
import { useMessages } from "../context/MessagesContext";
import { usePaths } from "../context/PathsContext";
import { Flow } from "../types/Flow";
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
	const inputRef = useRef<HTMLTextAreaElement>(null);

	// references a temporarily stored user input for use in attribute params
	const paramsInputRef = useRef<string>("");

	// checks if voice should be toggled back on after a user input
	const keepVoiceOnRef = useRef<boolean>(false);

	// audio to play for notifications
	const notificationAudio = useRef<HTMLAudioElement>();

	// tracks if user has interacted with page
	const [hasInteracted, setHasInteracted] = useState<boolean>(false);

	// tracks if notification is toggled on
	const [notificationToggledOn, setNotificationToggledOn] = useState<boolean>(true);

	// tracks if audio is toggled on
	const [audioToggledOn, setAudioToggledOn] = useState<boolean>(false);

	// tracks if voice is toggled on
	const [voiceToggledOn, setVoiceToggledOn] = useState<boolean>(false);

	// tracks if textarea is disabled
	const [textAreaDisabled, setTextAreaDisabled] = useState<boolean>(false);

	// tracks if chat history is being loaded
	const [isLoadingChatHistory, setIsLoadingChatHistory] = useState<boolean>(false);

	// tracks scroll height
	const [prevScrollHeight, setPrevScrollHeight] = useState<number>(0);

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
				const messageContent = {
					content: <ChatHistoryButton chatHistory={chatHistory} showChatHistory={showChatHistory} />,
					type: "object",
					isUser: false,
					timestamp: null,
				};
				setMessages([messageContent]);
			}
		}

		return () => {
			window.removeEventListener("click", handleFirstInteraction);
			window.removeEventListener("keydown", handleFirstInteraction);
			window.removeEventListener("touchstart", handleFirstInteraction);
		};
	}, []);

	// used to handle virtualkeyboard api (if supported on browser)
	useEffect(() => {
		// if is desktop or is embedded bot, nothing to resize
		if (isDesktop || botOptions.theme?.embedded) {
			return;
		}

		if ("virtualKeyboard" in navigator) {
			// @ts-expect-error virtualkeyboard type unknown
			navigator.virtualKeyboard.overlaysContent = true;
			// @ts-expect-error virtualkeyboard type unknown
			navigator.virtualKeyboard.addEventListener("geometrychange", (event) => {
				const { x, y, width, height } = event.target.boundingRect;
				// width does not need adjustments so only height is adjusted
				if (x == 0 && y == 0 && width == 0 && height == 0) {
					setTimeout(() => {
						setViewportHeight(window.visualViewport?.height as number);
					}, 501);
				} else {
					setTimeout(() => {
						setViewportHeight(window.visualViewport?.height as number - height);
					}, 501);
				}
			});
		}
	}, [])

	// triggers check for notifications
	useEffect(() => {
		handleNotifications();
	}, [messages]);

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

		if (botOptions.isOpen) {
			window.removeEventListener('scroll', handleMobileScrollClosed);
			document.body.style.position = "fixed";
			window.addEventListener("scroll", handleMobileScrollOpened);
			window.visualViewport?.addEventListener("resize", handleResize);

			return () => {
				window.removeEventListener("scroll", handleMobileScrollOpened);
				window.visualViewport?.removeEventListener("resize", handleResize);
			};
		} else {
			document.body.style.position = "static";
			window.removeEventListener("scroll", handleMobileScrollOpened);
			window.scrollTo({top: scrollPositionRef.current, left: 0, behavior: "auto"});
			window.addEventListener('scroll', handleMobileScrollClosed);
			window.visualViewport?.removeEventListener("resize", handleResize);

			return () => {
				window.removeEventListener("scroll", handleMobileScrollClosed);
			};
		}
	}, [botOptions.isOpen]);

	// performs pre-processing when paths change
	useEffect(() => {
		const currPath = getCurrPath();
		if (currPath == null) {
			return;
		}
		const block = flow[currPath];

		// if path is invalid, nothing to process (i.e. becomes dead end!)
		if (block == null) {
			return;
		}

		updateTextArea();
		syncVoiceWithChatInput(keepVoiceOnRef.current && !block.chatDisabled, botOptions);
		const params = {prevPath: getPrevPath(), userInput: paramsInputRef.current, injectMessage, openChat};
		callNewBlock(currPath, params);
	}, [paths]);

	/**
	 * Calls the new block for preprocessing upon change to path.
	 * 
	 * @param currPath the current path
	 * @param params parameters that may be used in the block
	 */
	const callNewBlock = async (currPath: string, params: Params) => {
		await preProcessBlock(flow, currPath, params, setTextAreaDisabled, setPaths, setTimeoutId, 
			handleActionInput);
		setIsBotTyping(false);
	}

	/**
	 * Sets up the notifications feature (initial toggle status and sound).
	 */
	const setUpNotifications = () => {
		setNotificationToggledOn(botOptions.notification?.defaultToggledOn as boolean);
	
		let notificationSound = botOptions.notification?.sound;

		// convert data uri to url if it is base64, true in production
		if (notificationSound?.startsWith("data:audio")) {
			const binaryString = atob(notificationSound.split(",")[1]);
			const arrayBuffer = new ArrayBuffer(binaryString.length);
			const uint8Array = new Uint8Array(arrayBuffer);
			for (let i = 0; i < binaryString.length; i++) {
				uint8Array[i] = binaryString.charCodeAt(i);
			}
			const blob = new Blob([uint8Array], { type: "audio/wav" });
			notificationSound = URL.createObjectURL(blob);
		}

		notificationAudio.current = new Audio(notificationSound);
		notificationAudio.current.volume = botOptions.notification?.volume as number;
	}

	/**
	 * Checks for initial user interaction (required to play audio/notification sound).
	 */
	const handleFirstInteraction = () => {
		setHasInteracted(true);

		// load audio on first user interaction
		notificationAudio.current?.load();

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
		// if embedded, or no message found, no need for notifications
		if (botOptions.theme?.embedded || messages.length == 0) {
			return;
		}
		const message = messages[messages.length - 1]
		if (message != null && !message?.isUser && (!botOptions.isOpen || document.visibilityState !== "visible")
			&& !isBotTyping) {
			setUnreadCount(prev => prev + 1);
			if (!botOptions.notification?.disabled && notificationToggledOn && hasInteracted) {
				notificationAudio.current?.play();
			}
		}
	}

	/**
	 * Retrieves current path for user.
	 */
	const getCurrPath = () => {
		return paths.length > 0 ? paths[paths.length -1] : null;
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
	 * @param isUser boolean indicating if the message comes from user
	 */
	const injectMessage = (content: string | JSX.Element, isUser = false) => {
		const message = {content: content, type: typeof content, isUser: isUser, timestamp: new Date()};
		processAudio(botOptions, audioToggledOn, message);
		updateMessages(setMessages, message, botOptions);
	}

	/**
	 * Loads and shows chat history in the chat window.
	 * 
	 * @param chatHistory chat history content to show
	 */
	const showChatHistory = (chatHistory: string) => {
		setIsLoadingChatHistory(true);
		setTextAreaDisabled(true);
		loadChatHistory(botOptions, chatHistory, setMessages, setIsLoadingChatHistory, setTextAreaDisabled);
	}

	/**
	 * Updates textarea disabled state based on current block.
	 */
	const updateTextArea = () => {
		const currPath = getCurrPath();
		if (currPath == null) {
			return;
		}
		const block = flow[currPath];
		if (block.chatDisabled != null) {
			setTextAreaDisabled(block.chatDisabled);
		} else {
			setTextAreaDisabled(botOptions.chatInput?.disabled as boolean);
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
	const handleActionInput = (path: string, userInput: string, sendUserInput = true) => {
		clearTimeout(timeoutId);
		userInput = userInput.trim();
		paramsInputRef.current = userInput;

		if (userInput === "") {
			return;
		}

		// Add user message to messages array
		if (sendUserInput) {
			injectMessage(userInput, true);
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
			const params = {prevPath: getPrevPath(), userInput, injectMessage, openChat};
			const hasNextPath = await postProcessBlock(flow, path, params, setPaths);
			if (!hasNextPath) {
				updateTextArea();
				syncVoiceWithChatInput(keepVoiceOnRef.current, botOptions);
				setIsBotTyping(false);
			}
		}, botOptions.chatInput?.botDelay);

		// short delay before auto-focusing back on textinput, required if textinput was disabled by blockspam option
		setTimeout(() => {
			inputRef.current?.focus();
		}, botOptions.chatInput?.botDelay as number + 100);
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
				borderRadius: '0px',
				left: '0px',
				right: 'auto',
				top: '0px',
				bottom: 'auto',
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
				<style>
					{`
						body {
							overflow: hidden;
							touch-action: none;
						}
					`}
				</style>
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
					isLoadingChatHistory={isLoadingChatHistory}
					prevScrollHeight={prevScrollHeight}	setPrevScrollHeight={setPrevScrollHeight}
				/>
				{botOptions.theme?.showInputRow &&
					<ChatBotInput handleToggleVoice={handleToggleVoice} handleActionInput={handleActionInput} 
						inputRef={inputRef} textAreaDisabled={textAreaDisabled} 
						voiceToggledOn={voiceToggledOn} getCurrPath={getCurrPath}
					/>
				}
				{botOptions.theme?.showFooter &&
					<ChatBotFooter inputRef={inputRef} flow={flow} textAreaDisabled={textAreaDisabled} 
						handleActionInput={handleActionInput} injectMessage={injectMessage}
						getCurrPath={getCurrPath} getPrevPath={getPrevPath} openChat={openChat}
					/>
				}
			</div>
		</div>
	);
};

export default ChatBotContainer;