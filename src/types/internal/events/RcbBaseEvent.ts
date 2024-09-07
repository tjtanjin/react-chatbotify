import { Actions } from "../../Actions";
import { Message } from "../../Message";
import { Settings } from "../../Settings";
import { Styles } from "../../Styles";

/**
 * Base rcb event which specifies custom event fields.
 */
export type RcbBaseEvent<T = any, eventDetail = EventDetail> = Omit<CustomEvent<T>, 'detail'> & {
	detail: eventDetail;
	data: T;
	actions: Actions;
	settings: Settings;
	styles: Styles;
	messages: Message[];
	paths: string[]
};