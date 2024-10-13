import { useEffect, useState, MouseEvent } from "react";

import { useToastInternal } from "../../../hooks/internal/useToastsInternal";
import { useSettingsContext } from "../../../context/SettingsContext";
import { useStylesContext } from "../../../context/StylesContext";

import "./ToastPrompt.css";

/**
 * Provides toast message prompt with information.
 * 
 * @param id id of the toast
 * @param content content of the toast
 * @param timeout timeout in milliseconds (optional) for removing toast
 */
const Toast = ({
	id,
	content,
	timeout,
}: {
	id: string;
	content: string | JSX.Element;
	timeout?: number;
}) => {

	// handles settings
	const { settings } = useSettingsContext();

	// handles styles
	const { styles } = useStylesContext();

	// handles toasts
	const { dismissToast } = useToastInternal();

	// tracks if toast prompt is hovered
	const [isHovered, setIsHovered] = useState<boolean>(false);

	// styles for toast prompt hovered
	const toastPromptHoveredStyle: React.CSSProperties = {
		color: settings.general?.primaryColor,
		borderColor: settings.general?.primaryColor,
		...styles.toastPromptHoveredStyle
	};

	useEffect(() => {
		// if timeout is set, dismiss toast after specified period
		if (timeout) {
			const timer = setTimeout(() => {
				dismissToast(id);
			}, timeout);
			return () => clearTimeout(timer);
		}
	}, [id, dismissToast, timeout]);

	/**
	 * Handles mouse enter event on toast prompt.
	 */
	const handleMouseEnter = () => {
		setIsHovered(true);
	};

	/**
	 * Handles mouse leave event on toast prompt.
	 */
	const handleMouseLeave = () => {
		setIsHovered(false);
	};

	return (
		typeof content === "string" ? (
			<div
				onMouseEnter={handleMouseEnter}
				onMouseLeave={handleMouseLeave} 
				style={isHovered ? toastPromptHoveredStyle : styles.toastPromptStyle}
				onMouseDown={(event: MouseEvent) => {
					if (settings.toast?.dismissOnClick) {
						event.preventDefault();
						dismissToast(id);
					}
				}}
				className="rcb-toast-prompt"
			>
				{content}
			</div>
		) : (
			<>
				{content}
			</>
		)
	);
};

export default Toast;
