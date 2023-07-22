
import { useEffect, useState } from "react";

import { useBotOptions } from "../../context/BotOptionsContext";
import { usePaths } from "../../context/PathsContext";

import "./UserCheckBoxes.css";

/**
 * Supports showing of checkboxes for user to mark.
 * 
 * @param checkBoxes object representing checkboxes to show and min/max number of selections
 * @param checkedItems set representing items marked
 * @param path path associated with the current block
 * @param handleActionInput handles input (marked checkboxes) from user
 */
const UserCheckBoxes = ({
	checkBoxes,
	checkedItems,
	path,
	handleActionInput,
}: {
	checkBoxes: {items: Array<string>, max?: number, min?: number};
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
	const botCheckBoxRowStyle = {
		cursor: disabled ? `url(${botOptions.theme?.actionDisabledImage}), auto` : "pointer",
		color: botOptions.theme?.primaryColor,
		borderColor: botOptions.theme?.primaryColor,
		...botOptions.botCheckBoxRowStyle
	};

	// styles for bot checkbox next button
	const botCheckBoxNextStyle = {
		cursor: disabled || checkedBoxes.size < (checkBoxes.min as number) 
			? `url(${botOptions.theme?.actionDisabledImage}), auto` : "pointer",
		color: botOptions.theme?.primaryColor,
		borderColor: botOptions.theme?.primaryColor,
		...botOptions.botCheckBoxNextStyle
	};

	// styles for bot checkmark
	const botCheckMarkStyle = {
		cursor: disabled ? `url(${botOptions.theme?.actionDisabledImage}), auto` : "pointer",
		color: "transparent",
		...botOptions.botCheckMarkStyle
	};

	// styles for bot selected checkmark
	const botCheckMarkSelectedStyle = {
		cursor: disabled ? `url(${botOptions.theme?.actionDisabledImage}), auto` : "pointer",
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
				if (checkedBoxes.size == checkBoxes.max) {
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
			{checkBoxes.items.map((key) => {
		
				return (
					<div
						onClick={() => handleCheckItems(key)}
						style={botCheckBoxRowStyle}
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
				style={botCheckBoxNextStyle}
				className="rcb-checkbox-next-button"
				disabled={disabled || checkedBoxes.size < (checkBoxes.min as number)}
				onClick={() => {
					const userInput = Array.from(checkedItems).join(", ");
					handleActionInput(path, userInput, botOptions.chatInput?.sendCheckboxOutput as boolean);
				}}
			>
			</button>
		</div>
	);
};

export default UserCheckBoxes;