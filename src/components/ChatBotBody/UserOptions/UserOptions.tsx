
import { useEffect, useState, MouseEvent } from "react";

import { useSubmitInputInternal } from "../../../hooks/internal/useSubmitInputInternal";
import { useSettingsContext } from "../../../context/SettingsContext";
import { useStylesContext } from "../../../context/StylesContext";
import { usePathsContext } from "../../../context/PathsContext";
import { Flow } from "../../../types/Flow";

import "./UserOptions.css";

/**
 * Supports showing of options for user to select.
 * 
 * @param options array representing options to show
 * @param path path associated with the current block
 */
const UserOptions = ({
	options,
	path,
}: {
	options: {items: Array<string>, sendOutput?: boolean, reusable?: boolean};
	path: keyof Flow;
}) => {

	// handles settings
	const { settings } = useSettingsContext();

	// handles styles
	const { styles } = useStylesContext();

	// handles paths of the user
	const { paths } = usePathsContext();

	// handles user input submission
	const { handleSubmitText } = useSubmitInputInternal();

	// handles hover action over options
	const [hoveredElements, setHoveredElements] = useState<boolean[]>([]);

	// handles state of options
	const [disabled, setDisabled] = useState<boolean>(false);

	// styles for bot option
	const botOptionStyle: React.CSSProperties = {
		cursor: disabled ? `url(${settings.general?.actionDisabledIcon}), auto` : "pointer",
		color: settings.general?.primaryColor,
		borderColor: settings.general?.primaryColor,
		backgroundColor: "#fff",
		...styles.botOptionStyle
	};

	// styles for bot hovered option
	const botOptionHoveredStyle: React.CSSProperties = {
		color: "#fff" ,
		borderColor: settings.general?.primaryColor,
		backgroundColor: settings.general?.primaryColor,
		...styles.botOptionHoveredStyle
	};

	// when moving on from current path, we also want to disable options if it is not reusable
	// cannot just rely on user input since path can change even without it (e.g. transition)
	useEffect(() => {
		if (paths.length > 0 && paths[paths.length - 1] !== path) {
			setDisabled(!options.reusable as boolean);
		}
	}, [paths]);

	/**
	 * Handles mouse enter event on an option.
	 */
	const handleMouseEnter = (index: number) => {
		setHoveredElements((prevHoveredElements) => {
			const newHoveredElements = [...prevHoveredElements];
			newHoveredElements[index] = true;
			return newHoveredElements;
		});
	};

	/**
	 * Handles mouse leave event on an option.
	 */
	const handleMouseLeave = (index: number) => {
		setHoveredElements((prevHoveredElements) => {
			const newHoveredElements = [...prevHoveredElements];
			newHoveredElements[index] = false;
			return newHoveredElements;
		});
	};

	return (
		<div className={`rcb-options-container ${settings.botBubble?.showAvatar ? "rcb-options-offset" : ""}`}>
			{options.items.map((key, index) => {
				const isHovered = hoveredElements[index] && !disabled;
		
				return (
					<div
						key={key}
						className="rcb-options"
						style={isHovered ? botOptionHoveredStyle : botOptionStyle}
						onMouseEnter={() => handleMouseEnter(index)}
						onMouseLeave={() => handleMouseLeave(index)}
						onMouseDown={(event: MouseEvent) => {
							event.preventDefault();
							if (disabled) {
								return;
							}
							setDisabled(!options.reusable as boolean);
							let sendInChat: boolean;
							if (options.sendOutput != null) {
								sendInChat = options.sendOutput;
							} else {
								sendInChat = settings.chatInput?.sendOptionOutput ?? true;
							}
							handleSubmitText(key, sendInChat);
						}}
					>
						{key}
					</div>
				);
			})}
		</div>
	);
};

export default UserOptions;
