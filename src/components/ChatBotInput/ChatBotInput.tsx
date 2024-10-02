import React, {
	useState,
	ChangeEvent,
	KeyboardEvent,
	RefObject,
	MouseEvent,
	Fragment,
} from "react";

import { useSubmitInputInternal } from "../../hooks/internal/useSubmitInputInternal";
import { useIsDesktopInternal } from "../../hooks/internal/useIsDesktopInternal";
import { useTextAreaInternal } from "../../hooks/internal/useTextAreaInternal";
import { useBotStatesContext } from "../../context/BotStatesContext";
import { useBotRefsContext } from "../../context/BotRefsContext";
import { useSettingsContext } from "../../context/SettingsContext";
import { useStylesContext } from "../../context/StylesContext";

import "./ChatBotInput.css";

/**
 * Contains chat input field for user to enter messages.
 * 
 * @param buttons list of buttons to render in the chat input
 */
const ChatBotInput = ({ buttons }: { buttons: JSX.Element[] }) => {
	// handles platform
	const isDesktop = useIsDesktopInternal();

	// handles settings
	const { settings } = useSettingsContext();

	// handles styles
	const { styles } = useStylesContext();

	// handles bot states
	const {
		textAreaDisabled,
		textAreaSensitiveMode,
		inputLength,
		hasFlowStarted,
		setHasFlowStarted,
		setInputLength
	} = useBotStatesContext();

	// handles bot refs
	const { inputRef } = useBotRefsContext();


	// tracks if chat input is focused
	const [isFocused, setIsFocused] = useState<boolean>(false);

	// tracks if text composition (like IME input) is in progress
	const [isComposing, setIsComposing] = useState<boolean>(false);

	// handles user input submission
	const { handleSubmitText } = useSubmitInputInternal();

	//handle textarea functionality
	const { setTextAreaValue } = useTextAreaInternal();

	// styles for text area
	const textAreaStyle: React.CSSProperties = {
		boxSizing: isDesktop ? "content-box" : "border-box",
		...styles.chatInputAreaStyle,
	};

	// styles for focused text area
	const textAreaFocusedStyle: React.CSSProperties = {
		outline: !textAreaDisabled ? "none" : "",
		boxShadow: !textAreaDisabled ? `0 0 5px ${settings.general?.primaryColor}` : "",
		boxSizing: isDesktop ? "content-box" : "border-box",
		...styles.chatInputAreaStyle, // by default inherit the base style for input area
		...styles.chatInputAreaFocusedStyle,
	};

	// styles for disabled text area
	const textAreaDisabledStyle: React.CSSProperties = {
		cursor: `url(${settings.general?.actionDisabledIcon}), auto`,
		caretColor: "transparent",
		boxSizing: isDesktop ? "content-box" : "border-box",
		...styles.chatInputAreaStyle, // by default inherit the base style for input area
		...styles.chatInputAreaDisabledStyle,
	};

	// styles for character limit
	const characterLimitStyle: React.CSSProperties = {
		color: "#989898",
		...styles.characterLimitStyle
	};

	// styles for character limit reached
	const characterLimitReachedStyle: React.CSSProperties = {
		color: "#ff0000",
		...styles.characterLimitReachedStyle
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
	 * Handles composition start event on chat input.
	 */
	const handleCompositionStart = () => {
		setIsComposing(true);
	};

	/**
	 * Handles composition end event on chat input.
	 */
	const handleCompositionEnd = () => {
		setIsComposing(false);
	};

	/**
	 * Handles keyboard events and proceeds to submit user input if enter button is pressed.
	 * 
	 * @param event keyboard event
	 */ 
	const handleKeyDown = async (event: KeyboardEvent<HTMLTextAreaElement | HTMLInputElement | null>) => {
		if (isComposing) {
			return;
		}
		if (event.key === "Enter") {
			if (event.shiftKey) {
				if (!settings.chatInput?.allowNewline) {
					event.preventDefault();
				}
				return;
			}
			event.preventDefault();
			await handleSubmitText();
		}
	};

	/**
	 * Handles textarea value changes.
	 * 
	 * @param event textarea change event
	 */
	const handleTextAreaValueChange = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement | null>) => {

		if (inputRef.current) {
			setTextAreaValue(event.target.value)
			setInputLength(inputRef.current.value.length);
		}
	};

	return (
		<div 
			aria-label={settings.ariaLabel?.inputTextArea ?? "input text area"}
			role="textbox" 
			onMouseDown={(event: MouseEvent) => {
				event.stopPropagation();
				// checks if user is interacting with chatbot for the first time
				if (!hasFlowStarted && settings.general?.flowStartTrigger === "ON_CHATBOT_INTERACT") {
					setHasFlowStarted(true);
				}
			}}
			style={styles.chatInputContainerStyle} 
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
					onCompositionStart={handleCompositionStart}
					onCompositionEnd={handleCompositionEnd}
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
					onCompositionStart={handleCompositionStart}
					onCompositionEnd={handleCompositionEnd}
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
