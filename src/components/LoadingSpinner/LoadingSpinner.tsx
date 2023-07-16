import { useBotOptions } from "../../context/BotOptionsContext";

import "./LoadingSpinner.css";

/**
 * Shows a spinning indicator when loading chat history.
 */
const LoadingSpinner = () => {

	// handles options for bot
	const { botOptions } = useBotOptions();

	// styles for spinner
	const loadingSpinnerStyle = {
		borderTop: `4px solid ${botOptions.theme?.primaryColor}`,
		...botOptions.loadingSpinnerStyle
	};

	return (
		<div className="rcb-spinner-container">
			<div style={loadingSpinnerStyle} className="rcb-spinner"></div>
		</div>
	);
};

export default LoadingSpinner;