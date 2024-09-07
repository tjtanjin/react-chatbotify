import { Actions } from "../types/Actions";
import { Message } from "../types/Message";
import { Settings } from "../types/Settings";
import { Styles } from "../types/Styles";
import { RcbEvent } from "../constants/internal/RcbEvent";
import { RcbBaseEvent } from "../types/internal/events/RcbBaseEvent";

const cancellableMap = {
	[RcbEvent.AUDIO_TOGGLE]: true,
	// todo: add more
}

// const deepCopyDataMap = {
// 	// todo: for events that should not allow data to be modified
// }

/**
 * Emits a custom event with specified name.
 *
 * @param eventName name of the event to emit
 * @param eventDetail additional data to include with the event.
 */
export const emitRcbEvent = (eventName: string, eventDetail: EventDetail, data: object,
	actions: Actions, settings: Settings, styles: Styles, messages: Message[], paths: string[]): RcbBaseEvent => {

	// Create a custom event with the provided name and detail
	const event: RcbBaseEvent = new CustomEvent(eventName, {
		detail: eventDetail,
		cancelable: cancellableMap.eventName,
	}) as RcbBaseEvent<typeof data, EventDetail>;

	event.data = data;
	event.actions = actions;
	event.settings = settings;
	event.styles = styles;
	event.messages = messages;
	event.paths = paths;

	window.dispatchEvent(event);
	return event;
}