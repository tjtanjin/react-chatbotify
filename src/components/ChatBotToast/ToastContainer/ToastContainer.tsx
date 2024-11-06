import { CSSProperties } from "react";

import ToastPrompt from "../ToastPrompt/ToastPrompt";
import { useStylesContext } from "../../../context/StylesContext";
import { useToastsContext } from "../../../context/ToastsContext";

import "./ToastContainer.css";

/**
 * Holds toast prompts.
 * 
 */
const ToastContainer = () => {
	// handles styles
	const { styles } = useStylesContext();

	// handles toasts
	const { toasts } = useToastsContext();

	// styles for toast prompt container
	const toastPromptContainerStyle: CSSProperties = {
		bottom: (styles.footerStyle?.height as number ?? 50) +
			(styles.chatInputContainerStyle?.height as number ?? 70) + 20,
		width: 300,
		minWidth: (styles.chatWindowStyle?.width as number ?? 375) / 2,
		maxWidth: (styles.chatWindowStyle?.width as number ?? 375) - 50,
		...styles.toastPromptContainerStyle
	};

	return (
		<div className="rcb-toast-prompt-container" style={toastPromptContainerStyle}>
			{toasts.map((toast) => (
				<ToastPrompt
					key={toast.id}
					id={toast.id}
					content={toast.content}
					timeout={toast.timeout}
				/>
			))}
		</div>
	);
};

export default ToastContainer;
