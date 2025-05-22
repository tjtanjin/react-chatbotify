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

	// todo: this is pretty verbose, consider tidying this up in future
	// styles for toast prompt container
	const toastPromptContainerStyle: CSSProperties = {
		bottom: `calc(${typeof styles.footerStyle?.height === 'number'
			? `${styles.footerStyle?.height}px`
			: styles.footerStyle?.height ?? '50px'} + ${typeof styles.chatInputContainerStyle?.height === 'number'
			? `${styles.chatInputContainerStyle?.height}px`
			: styles.chatInputContainerStyle?.height ?? '70px'} + 20px)`,
		width: 300,
		minWidth: `calc(${typeof styles.chatWindowStyle?.width === 'number'
			? `${styles.chatWindowStyle?.width}px`
			: styles.chatWindowStyle?.width ?? '375px'} / 2)`,
		maxWidth: `calc(${typeof styles.chatWindowStyle?.width === 'number'
			? `${styles.chatWindowStyle?.width}px`
			: styles.chatWindowStyle?.width ?? '375px'} - 50px)`,
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
