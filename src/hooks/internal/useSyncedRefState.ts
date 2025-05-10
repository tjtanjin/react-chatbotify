import { useRef, useState, SetStateAction, MutableRefObject } from "react";

/**
 * Internal custom hook for creating synced ref and state.
 */
export const useSyncedRefState = <T>(
	initialValue: T
): [T, (value: SetStateAction<T>) => void, MutableRefObject<T>] => {
	const [state, setState] = useState<T>(initialValue);
	const syncRef = useRef<T>(initialValue);

	/**
	 * Updates a state and the ref value together to ensure sync.
	 *
	 * @param value value to update
	 */
	const setSyncedState = (value: SetStateAction<T>) => {
		const newValue =
			typeof value === 'function'
				? (value as (prev: T) => T)(syncRef.current)
				: value;
		syncRef.current = newValue;
		setState(newValue);
	};

	return [state, setSyncedState, syncRef];
};
