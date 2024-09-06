
import { useEffect, useState, MouseEvent } from "react";

import { useSettings } from "../../../context/SettingsContext";
import { useStyles } from "../../../context/StylesContext";
import { usePaths } from "../../../context/PathsContext";
import { Flow } from "../../../types/Flow";

import "./UserOptions.css";

/**
 * Supports showing of options for user to select.
 * 
 * @param options array representing options to show
 * @param path path associated with the current block
 * @param handleActionInput handles input (selected option) from user
 */
const UserOptions= ({
	options,
	path,
	handleActionInput
}: {
	options: {items: Array<string>, sendOutput?: boolean, reusable?: boolean};
	path: keyof Flow;
	handleActionInput: (path: keyof Flow, userInput: string, sendUserInput: boolean) => Promise<void>;
}) => {

	// handles settings for bot
	const { settings } = useSettings();

	// handles styles for bot
	const { styles } = useStyles();

	// handles paths of the user
	const { paths } = usePaths();

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
							if (options.sendOutput) {
								sendInChat = options.sendOutput;
							} else {
								sendInChat = settings.chatInput?.sendOptionOutput || true;
							}
							handleActionInput(path, key, sendInChat);
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