import React, {
	useState,
	ChangeEvent,
	KeyboardEvent,
	RefObject,
	MouseEvent,
	SetStateAction,
	Dispatch,
	Fragment,
} from "react";

import { isDesktop } from "../../utils/displayChecker";
import { useSettings } from "../../context/SettingsContext";

import "./ChatBotInput.css";

/**
 * Contains chat input field for user to enter messages.
 * 
 * @param inputRef reference to the textarea
 * @param textAreaDisabled boolean indicating if textarea is disabled
 * @param textAreaSensitveMode boolean indicating is textarea is in sensitve mode
 * @param inputLength current length of input in text area
 * @param setInputLength sets the input length to reflect character count & limit
 * @param handleSubmit handles submission of user input
 * @param hasFlowStarted boolean indicating if flow has started
 * @param setHasFlowStarted sets whether the flow has started
 * @param buttons list of buttons to render in the chat input
 */
const ChatBotInput = ({
	inputRef,
	textAreaDisabled,
	textAreaSensitiveMode,
	inputLength,
	setInputLength,
	handleSubmit,
	hasFlowStarted,
	setHasFlowStarted,
	buttons
}: {
	inputRef: RefObject<HTMLTextAreaElement | HTMLInputElement>;
	textAreaDisabled: boolean;
	textAreaSensitiveMode: boolean;
	inputLength: number;
	setInputLength: Dispatch<SetStateAction<number>>;
	handleSubmit: () => void
	hasFlowStarted: boolean;
	setHasFlowStarted: Dispatch<SetStateAction<boolean>>;
	buttons: JSX.Element[];
}) => {

	// handles options for bot
	const { settings } = useSettings();

	// tracks if chat input is focused
	const [isFocused, setIsFocused] = useState<boolean>(false);

	// styles for text area
	const textAreaStyle: React.CSSProperties = {
		boxSizing: isDesktop ? "content-box" : "border-box",
		...settings.chatInputAreaStyle,
	};

	// styles for focused text area
	const textAreaFocusedStyle: React.CSSProperties = {
		outline: !textAreaDisabled ? "none" : "",
		boxShadow: !textAreaDisabled ? `0 0 5px ${settings.theme?.primaryColor}` : "",
		boxSizing: isDesktop ? "content-box" : "border-box",
		...settings.chatInputAreaStyle, // by default inherit the base style for input area
		...settings.chatInputAreaFocusedStyle,
	};

	// styles for disabled text area
	const textAreaDisabledStyle: React.CSSProperties = {
		cursor: `url(${settings.theme?.actionDisabledIcon}), auto`,
		caretColor: "transparent",
		boxSizing: isDesktop ? "content-box" : "border-box",
		...settings.chatInputAreaStyle, // by default inherit the base style for input area
		...settings.chatInputAreaDisabledStyle,
	};

	// styles for character limit
	const characterLimitStyle: React.CSSProperties = {
		color: "#989898",
		...settings.characterLimitStyle
	};

	// styles for character limit reached
	const characterLimitReachedStyle: React.CSSProperties = {
		color: "#ff0000",
		...settings.characterLimitReachedStyle
	};

	// styles for input placeholder
	const placeholder = textAreaDisabled
		? settings.chatInput?.disabledPlaceholderText
		: settings.chatInput?.enabledPlaceholderText;

	/**
	 * Handles focus event on chat input.
	 */
	const handleFocus = () => {
		if (textAreaDisabled) {
			return;
		}
		setIsFocused(true);
	};

	/**
	 * Handles blur event on chat input.
	 */
	const handleBlur = () => {
		setIsFocused(false);
	};

	/**
	 * Handles keyboard events and proceeds to submit user input if enter button is pressed.
	 * 
	 * @param event keyboard event
	 */ 
	const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>) => {
		if (event.key === "Enter") {
			if (event.shiftKey) {
				if (!settings.chatInput?.allowNewline) {
					event.preventDefault();
				}
				return;
			}
			event.preventDefault();
			handleSubmit();
		}
	};

	/**
	 * Handles textarea value changes.
	 * 
	 * @param event textarea change event
	 */
	const handleTextAreaValueChange = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
		if (textAreaDisabled && inputRef.current) {
			// prevent input and keep current value
			inputRef.current.value = "";
			return;
		}

		if (inputRef.current) {
			const characterLimit = settings.chatInput?.characterLimit
			/*
			* @params allowNewline Boolean
			* allowNewline [true] Allow input values to contain line breaks '\n'
			* allowNewline [false] Replace \n with a space
			* */
			const allowNewline = settings.chatInput?.allowNewline
			const newInput = allowNewline ? event.target.value : event.target.value.replace(/\n/g, " ");
			if (characterLimit != null && characterLimit >= 0 && newInput.length > characterLimit) {
				inputRef.current.value = newInput.slice(0, characterLimit);
			} else {
				inputRef.current.value = newInput
			}
			setInputLength(inputRef.current.value.length);
		}
	};

	return (
		<div 
			onMouseDown={(event: MouseEvent) => {
				event.stopPropagation();
				// checks if user is interacting with chatbot for the first time
				if (!hasFlowStarted && settings.theme?.flowStartTrigger === "ON_CHATBOT_INTERACT") {
					setHasFlowStarted(true);
				}
			}}
			style={settings.chatInputContainerStyle} 
			className="rcb-chat-input"
		>
			{/* textarea intentionally does not use the disabled property to prevent keyboard from closing on mobile */}
			{textAreaSensitiveMode && settings.sensitiveInput?.maskInTextArea ?
				<input
					ref={inputRef as RefObject<HTMLInputElement>}
					type="password"
					className="rcb-chat-input-textarea"
					style={textAreaDisabled
						? textAreaDisabledStyle
						: (isFocused ? textAreaFocusedStyle : textAreaStyle)}
					placeholder={placeholder}
					onChange={handleTextAreaValueChange}
					onKeyDown={handleKeyDown}
					onFocus={handleFocus}
					onBlur={handleBlur}
				/>
				:
				<textarea
					ref={inputRef as RefObject<HTMLTextAreaElement>}
					style={textAreaDisabled
						? textAreaDisabledStyle
						: (isFocused ? textAreaFocusedStyle : textAreaStyle)}
					rows={1}
					className="rcb-chat-input-textarea"
					placeholder={placeholder}
					onChange={handleTextAreaValueChange}
					onKeyDown={handleKeyDown}
					onFocus={handleFocus}
					onBlur={handleBlur}
				/>
			}
			<div className="rcb-chat-input-button-container">
				{buttons?.map((button: JSX.Element, index: number) => 
					<Fragment key={index}>{button}</Fragment>
				)}
				{settings.chatInput?.showCharacterCount
					&& settings.chatInput?.characterLimit != null
					&& settings.chatInput?.characterLimit > 0
					&&
					<div 
						className="rcb-chat-input-char-counter"
						style={inputLength >= settings.chatInput?.characterLimit
							? characterLimitReachedStyle
							: characterLimitStyle
						}
					>
						{inputLength}/{settings.chatInput?.characterLimit}
					</div>
				}
			</div>
		</div>
	);
};

export default ChatBotInput;