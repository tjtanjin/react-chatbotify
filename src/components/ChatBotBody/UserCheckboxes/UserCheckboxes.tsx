
import { useEffect, useState, MouseEvent } from "react";

import { useSubmitInputInternal } from "../../../hooks/internal/useSubmitInputInternal";
import { useSettingsContext } from "../../../context/SettingsContext";
import { useStylesContext } from "../../../context/StylesContext";
import { usePathsContext } from "../../../context/PathsContext";
import { Flow } from "../../../types/Flow";

import "./UserCheckboxes.css";

/**
 * Supports showing of checkboxes for user to mark.
 * 
 * @param checkboxes object representing checkboxes to show and min/max number of selections
 * @param checkedItems set representing items marked
 * @param path path associated with the current block
 */
const UserCheckboxes = ({
	checkboxes,
	checkedItems,
	path,
}: {
	checkboxes: {items: Array<string>, max?: number, min?: number, sendOutput?: boolean, reusable?: boolean};
	checkedItems: Set<string>;
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

	// tracks which checkboxes have been marked
	const [checkedBoxes, setCheckedBoxes] = useState<Set<string>>(new Set<string>());

	// handles state of checkboxes
	const [disabled, setDisabled] = useState<boolean>(false);

	// styles for bot checkbox row items
	const botCheckboxRowStyle: React.CSSProperties = {
		cursor: disabled ? `url(${settings.general?.actionDisabledIcon}), auto` : "pointer",
		color: settings.general?.primaryColor,
		borderColor: settings.general?.primaryColor,
		...styles.botCheckboxRowStyle
	};

	// styles for bot checkbox next button
	const botCheckboxNextStyle: React.CSSProperties = {
		cursor: disabled || checkedBoxes.size < (checkboxes.min as number) 
			? `url(${settings.general?.actionDisabledIcon}), auto` : "pointer",
		color: settings.general?.primaryColor,
		borderColor: settings.general?.primaryColor,
		...styles.botCheckboxNextStyle
	};

	// styles for bot checkmark
	const botCheckMarkStyle: React.CSSProperties = {
		cursor: disabled ? `url(${settings.general?.actionDisabledIcon}), auto` : "pointer",
		color: "transparent",
		...styles.botCheckMarkStyle
	};

	// styles for bot selected checkmark
	const botCheckMarkSelectedStyle: React.CSSProperties = {
		cursor: disabled ? `url(${settings.general?.actionDisabledIcon}), auto` : "pointer",
		color: "#fff",
		borderColor: settings.general?.primaryColor,
		backgroundColor: settings.general?.primaryColor,
		...styles.botCheckMarkSelectedStyle
	};

	// when moving on from current path, we also want to disable checkboxes if it is not reusable
	// cannot just rely on user input since path can change even without it (e.g. transition)
	useEffect(() => {
		if (paths.length > 0 && paths[paths.length - 1] !== path) {
			setDisabled(!checkboxes.reusable as boolean);
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
		<div className={`rcb-checkbox-container ${settings.botBubble?.showAvatar ? "rcb-checkbox-offset" : ""}`}>
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
			<div
				style={botCheckboxNextStyle}
				className="rcb-checkbox-next-button"
				onMouseDown={(event: MouseEvent) => {
					event.preventDefault();
					if (disabled || checkedBoxes.size < (checkboxes.min as number)) {
						return;
					}
					const userInput = Array.from(checkedItems).join(", ");
					setDisabled(!checkboxes.reusable as boolean);
					let sendInChat: boolean;
					if (checkboxes.sendOutput != null) {
						sendInChat = checkboxes.sendOutput;
					} else {
						sendInChat = settings.chatInput?.sendCheckboxOutput ?? true;
					}
					handleSubmitText(userInput, sendInChat);
				}}
			>
			</div>
		</div>
	);
};

export default UserCheckboxes;
