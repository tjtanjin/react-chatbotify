import { useState, useRef, useEffect } from "react";

import { useTextAreaInternal } from "../../../hooks/internal/useTextAreaInternal";
import { useBotRefsContext } from "../../../context/BotRefsContext";
import { useSettingsContext } from "../../../context/SettingsContext";
import { useStylesContext } from "../../../context/StylesContext";

import "./EmojiButton.css";

/**
 * Supports selecting of emojis.
 */
const EmojiButton = () => {

	// handles settings
	const { settings } = useSettingsContext();

	// handles styles
	const { styles } = useStylesContext();

	// handles bot refs
	const { inputRef } = useBotRefsContext();

	// handles input text area
	const { textAreaDisabled, setTextAreaValue } = useTextAreaInternal();

	// reference to popup
	const popupRef = useRef<HTMLDivElement | null>(null);

	// reference to icon container
	const iconContainerRef = useRef<HTMLDivElement | null>(null);

	// handles showing of emoji popup
	const [showPopup, setShowPopup] = useState<boolean>(false);

	// styles for emoji disabled button
	const emojiButtonDisabledStyle: React.CSSProperties = {
		cursor: `url(${settings.general?.actionDisabledIcon}), auto`,
		...styles.emojiButtonDisabledStyle
	};

	// styles for emoji icon
	const emojiIconStyle: React.CSSProperties = {
		backgroundImage: `url(${settings.emoji?.icon})`,
		...styles.emojiIconStyle
	};

	// styles for emoji disabled icon
	const emojiIconDisabledStyle: React.CSSProperties = {
		backgroundImage: `url(${settings.emoji?.icon})`,
		...styles.emojiIconDisabledStyle
	};

	// handles click events for showing/dismissing emoji popup
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			const path = event.composedPath();

			if (
				popupRef.current &&
				!path.includes(popupRef.current) &&
				iconContainerRef.current &&
				!path.includes(iconContainerRef.current)
			) {
				setShowPopup(false);
			}
		};

		const calculatePopupPosition = () => {
			if (popupRef.current && iconContainerRef.current) {
				const headerRect = iconContainerRef.current.getBoundingClientRect();
				const popupHeight = popupRef.current.offsetHeight;
				const popupTop = headerRect.top - popupHeight - 8; // 8px spacing
				popupRef.current.style.left = `${headerRect.left}px`;
				popupRef.current.style.top = `${popupTop}px`;
			}
		};

		const handleWindowResize = () => {
			calculatePopupPosition();
		};

		document.addEventListener("mousedown", handleClickOutside);
		window.addEventListener("resize", handleWindowResize);

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
			window.removeEventListener("resize", handleWindowResize);
		};
	}, []); 

	/**
	 * Handles clicking on emoji in popup.
	 * 
	 * @param event mouse event
	 * @param emoji emoji that user selected from popup
	 */
	const handleEmojiClick = (event: React.MouseEvent, emoji: string) => {
		event.preventDefault();
		if (inputRef.current) {
			setTextAreaValue(inputRef.current.value + emoji);
			setTimeout(() => {
				const inputElement = inputRef.current;
				if (inputElement) {
					inputElement.focus();
					const length = inputElement.value.length;
					inputElement.setSelectionRange(length, length);
				}
			}, 50)
		}
		setShowPopup(false);
	};

	/**
	 * Toggles showing of emoji popup (does not show popup if textarea is disabled).
	 * 
	 * @param event mouse event
	 */
	const togglePopup = (event: React.MouseEvent) => {
		event.preventDefault();
		if (textAreaDisabled) {
			setShowPopup(false);
		} else {
			setShowPopup(!showPopup);
		}
	};

	return (
		<>
			<div
				ref={iconContainerRef}
				className={`${textAreaDisabled ? "rcb-emoji-button-disabled" : "rcb-emoji-button-enabled"}`}
				style={textAreaDisabled ? emojiButtonDisabledStyle : styles.emojiButtonStyle}
				onMouseDown={togglePopup}
			>
				<span
					className={`${textAreaDisabled ? "rcb-emoji-icon-disabled" : "rcb-emoji-icon-enabled"}`}
					style={textAreaDisabled ? emojiIconDisabledStyle : emojiIconStyle}
				/>
			</div>
			{showPopup && (
				<div className="rcb-emoji-button-popup" ref={popupRef}>
					{settings.emoji?.list?.map((emoji, index) => (
						<span
							key={index}
							className="rcb-emoji"
							onMouseDown={(event: React.MouseEvent) => 
								handleEmojiClick(event, emoji)
							}
						>
							{emoji}
						</span>
					))}
				</div>
			)}
		</>
	);
};

export default EmojiButton;
