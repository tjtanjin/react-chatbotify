
import { useEffect, useState, MouseEvent } from "react";

import { useBotOptions } from "../../context/BotOptionsContext";
import { usePaths } from "../../context/PathsContext";

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
	options: string[];
	path: string;
	handleActionInput: (path: string, userInput: string, sendUserInput: boolean) => void;
}) => {

	// handles options for bot
	const { botOptions } = useBotOptions();

	// handles paths of the user
	const { paths } = usePaths();

	// handles hover action over options
	const [hoveredElements, setHoveredElements] = useState<boolean[]>([]);

	// handles state of options
	const [disabled, setDisabled] = useState<boolean>(false);

	// styles for bot option
	const botOptionStyle = {
		cursor: disabled ? `url(${botOptions.theme?.actionDisabledIcon}), auto` : "pointer",
		color: botOptions.theme?.primaryColor,
		borderColor: botOptions.theme?.primaryColor,
		backgroundColor: "#fff",
		...botOptions.botOptionStyle
	};

	// styles for bot hovered option
	const botOptionHoveredStyle = {
		color: "#fff" ,
		borderColor: botOptions.theme?.primaryColor,
		backgroundColor: botOptions.theme?.primaryColor,
		...botOptions.botOptionHoveredStyle
	};

	// disables options when moving on from current path
	useEffect(() => {
		if (paths.length > 0 && paths[paths.length - 1] !== path) {
			setDisabled(true);
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
		<div className={`rcb-options-container ${botOptions.botBubble?.showAvatar ? "rcb-options-offset" : ""}`}>
			{options.map((key, index) => {
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

							handleActionInput(path, key, botOptions.chatInput?.sendOptionOutput as boolean);
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