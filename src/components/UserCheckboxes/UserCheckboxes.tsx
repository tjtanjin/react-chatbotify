
import { useEffect, useState, MouseEvent } from "react";

import { useBotOptions } from "../../context/BotOptionsContext";
import { usePaths } from "../../context/PathsContext";

import "./UserCheckboxes.css";

/**
 * Supports showing of checkboxes for user to mark.
 * 
 * @param checkboxes object representing checkboxes to show and min/max number of selections
 * @param checkedItems set representing items marked
 * @param path path associated with the current block
 * @param handleActionInput handles input (marked checkboxes) from user
 */
const UserCheckboxes = ({
	checkboxes,
	checkedItems,
	path,
	handleActionInput,
}: {
	checkboxes: {items: Array<string>, max?: number, min?: number};
	checkedItems: Set<string>;
	path: string;
	handleActionInput: (path: string, userInput: string, sendUserInput: boolean) => void;
}) => {

	// handles options for bot
	const { botOptions } = useBotOptions()

	// handles paths of the user
	const { paths } = usePaths();

	// tracks which checkboxes have been marked
	const [checkedBoxes, setCheckedBoxes] = useState<Set<string>>(new Set<string>());

	// handles state of checkboxes
	const [disabled, setDisabled] = useState<boolean>(false);

	// styles for bot checkbox row items
	const botCheckboxRowStyle = {
		cursor: disabled ? `url(${botOptions.theme?.actionDisabledIcon}), auto` : "pointer",
		color: botOptions.theme?.primaryColor,
		borderColor: botOptions.theme?.primaryColor,
		...botOptions.botCheckboxRowStyle
	};

	// styles for bot checkbox next button
	const botCheckboxNextStyle = {
		cursor: disabled || checkedBoxes.size < (checkboxes.min as number) 
			? `url(${botOptions.theme?.actionDisabledIcon}), auto` : "pointer",
		color: botOptions.theme?.primaryColor,
		borderColor: botOptions.theme?.primaryColor,
		...botOptions.botCheckboxNextStyle
	};

	// styles for bot checkmark
	const botCheckMarkStyle = {
		cursor: disabled ? `url(${botOptions.theme?.actionDisabledIcon}), auto` : "pointer",
		color: "transparent",
		...botOptions.botCheckMarkStyle
	};

	// styles for bot selected checkmark
	const botCheckMarkSelectedStyle = {
		cursor: disabled ? `url(${botOptions.theme?.actionDisabledIcon}), auto` : "pointer",
		color: "#fff",
		borderColor: botOptions.theme?.primaryColor,
		backgroundColor: botOptions.theme?.primaryColor,
		...botOptions.botCheckMarkSelectedStyle
	};

	// disables checkboxes when moving on from current path
	useEffect(() => {
		if (paths.length > 0 && paths[paths.length - 1] !== path) {
			setDisabled(true);
		}
	}, [paths]);
	
	// handles marking/unmarking of checkboxes
	const handleCheckItems = (label: string) => {
		if (disabled) {
			return;
		}

		setCheckedBoxes((prevCheckedBoxes) => {
			const updatedCheckboxes = new Set(prevCheckedBoxes);
			if (updatedCheckboxes.has(label)) {
				checkedItems.delete(label);
				updatedCheckboxes.delete(label);
			} else {
				if (checkedBoxes.size == checkboxes.max) {
					return prevCheckedBoxes;
				}
				checkedItems.add(label);
				updatedCheckboxes.add(label);
			}
			return updatedCheckboxes;
		});
	};

	return (
		<div className={`rcb-checkbox-container ${botOptions.botBubble?.showAvatar ? "rcb-checkbox-offset" : ""}`}>
			{checkboxes.items.map((key) => {
		
				return (
					<div
						onMouseDown={(event: MouseEvent) => {
							event.preventDefault();
							handleCheckItems(key)
						}}
						style={botCheckboxRowStyle}
						key={key}
						className="rcb-checkbox-row-container"
					>
						<div className="rcb-checkbox-row">
							<div
								style={checkedBoxes.has(key) ? botCheckMarkSelectedStyle : botCheckMarkStyle}
								className="rcb-checkbox-mark"
							/>
							<div className="rcb-checkbox-label">{key}</div>
						</div>
					</div>
				);
			})}
			<button
				style={botCheckboxNextStyle}
				className="rcb-checkbox-next-button"
				disabled={disabled || checkedBoxes.size < (checkboxes.min as number)}
				onMouseDown={(event: MouseEvent) => {
					event.preventDefault();
					const userInput = Array.from(checkedItems).join(", ");
					handleActionInput(path, userInput, botOptions.chatInput?.sendCheckboxOutput as boolean);
				}}
			>
			</button>
		</div>
	);
};

export default UserCheckboxes;