import { useSettings } from "../../context/SettingsContext";
import { useStyles } from "../../context/StylesContext";

import "./LoadingSpinner.css";

/**
 * Shows a spinning indicator when loading chat history.
 */
const LoadingSpinner = () => {

	// handles settings for bot
	const { settings } = useSettings();

	// handles styles for bot
	const { styles } = useStyles();

	// styles for spinner
	const loadingSpinnerStyle: React.CSSProperties = {
		borderTop: `4px solid ${settings.general?.primaryColor}`,
		...styles.loadingSpinnerStyle
	};

	return (
		<div className="rcb-spinner-container">
			<div style={loadingSpinnerStyle} className="rcb-spinner"></div>
		</div>
	);
};

export default LoadingSpinner;