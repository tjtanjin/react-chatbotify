import { useBotSettings } from "../../context/BotSettingsContext";

import "./LoadingSpinner.css";

/**
 * Shows a spinning indicator when loading chat history.
 */
const LoadingSpinner = () => {

	// handles options for bot
	const { botSettings } = useBotSettings();

	// styles for spinner
	const loadingSpinnerStyle: React.CSSProperties = {
		borderTop: `4px solid ${botSettings.general?.primaryColor}`,
		...botSettings.loadingSpinnerStyle
	};

	return (
		<div className="rcb-spinner-container">
			<div style={loadingSpinnerStyle} className="rcb-spinner"></div>
		</div>
	);
};

export default LoadingSpinner;