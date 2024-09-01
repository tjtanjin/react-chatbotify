import { Actions } from "../Actions";
import { Message } from "../Message";
import { Settings } from "../Settings";
import { Styles } from "../Styles";

/**
 * 
 */
export type RcbEvent<T = any> = CustomEvent<T> & {
	actions?: Actions;
	settings?: Settings;
	styles?: Styles;
	messages?: Message[];
	paths?: string[]
};