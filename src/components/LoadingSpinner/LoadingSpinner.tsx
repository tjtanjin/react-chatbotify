import { useSettings } from "../../context/SettingsContext";

import "./LoadingSpinner.css";

/**
 * Shows a spinning indicator when loading chat history.
 */
const LoadingSpinner = () => {

	// handles options for bot
	const { settings } = useSettings();

	// styles for spinner
	const loadingSpinnerStyle: React.CSSProperties = {
		borderTop: `4px solid ${settings.theme?.primaryColor}`,
		...settings.loadingSpinnerStyle
	};

	return (
		<div className="rcb-spinner-container">
			<div style={loadingSpinnerStyle} className="rcb-spinner"></div>
		</div>
	);
};

export default LoadingSpinner;