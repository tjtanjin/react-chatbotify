import { EventDetail } from "./EventDetail";
import { Message } from "../../Message";
import { Settings } from "../../Settings";
import { Styles } from "../../Styles";

/**
 * Base rcb event which specifies custom event fields.
 */
export type RcbBaseEvent<T = any, U = EventDetail> = Omit<CustomEvent<T>, 'detail'> & {
	detail: U;
	data: T;
	settings: Settings;
	styles: Styles;
	messages: Message[];
	paths: string[]
};
