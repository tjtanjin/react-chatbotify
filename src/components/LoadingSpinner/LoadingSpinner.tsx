import { useSettingsContext } from "../../context/SettingsContext";
import { useStylesContext } from "../../context/StylesContext";

import "./LoadingSpinner.css";

/**
 * Shows a spinning indicator when loading chat history.
 */
const LoadingSpinner = () => {
	// handles settings
	const { settings } = useSettingsContext();

	// handles styles
	const { styles } = useStylesContext();

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
