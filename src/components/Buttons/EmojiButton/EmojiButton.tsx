import { useState, useRef, useEffect, RefObject } from "react";

import { useSettings } from "../../../context/SettingsContext";

import "./EmojiButton.css";

/**
 * Supports selecting of emojis.
 * 
 * @param inputRef reference to the textarea
 * @param textAreaDisabled boolean indicating if textarea is disabled
 */
const EmojiButton = ({
	inputRef,
	textAreaDisabled
}: {
	inputRef: RefObject<HTMLTextAreaElement | HTMLInputElement>;
	textAreaDisabled: boolean;
}) => {

	// handles options for bot
	const { settings } = useSettings();

	// reference to popup
	const popupRef = useRef<HTMLDivElement>(null);

	// reference to icon container
	const iconContainerRef = useRef<HTMLDivElement>(null);

	// handles showing of emoji popup
	const [showPopup, setShowPopup] = useState<boolean>(false);

	// styles emoji button when disabled
	const emojiButtonDisabledStyle: React.CSSProperties = {
		cursor: `url(${settings.theme?.actionDisabledIcon}), auto`,
	};

	// handles click events for showing/dismissing emoji popup
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				popupRef.current &&
				!popupRef.current.contains(event.target as Node) &&
				iconContainerRef.current &&
				!iconContainerRef.current.contains(event.target as Node)
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
			inputRef.current.value = inputRef.current.value + emoji;
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
				style={textAreaDisabled ? emojiButtonDisabledStyle : {}} 
				className={`${textAreaDisabled ? "rcb-emoji-button-disabled" : "rcb-emoji-button-enabled"}`}
				onMouseDown={togglePopup}
			>
				<span
					style={{backgroundImage: `url(${settings.emoji?.icon})`}}
					className={`${textAreaDisabled ? "rcb-emoji-icon-disabled" : "rcb-emoji-icon-enabled"}`}
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
