import { Actions } from "../types/Actions";
import { Message } from "../types/Message";
import { RcbEvent } from "../types/rcbEvents/RcbEvent";
import { Settings } from "../types/Settings";
import { Styles } from "../types/Styles";

/**
 * Emits a custom event with specified name and detail and checks if it is prevented.
 *
 * @param eventName name of the event to emit
 * @param eventDetail additional data to include with the event.
 */
const emitEventAndGetIsPrevented = (eventName: string, cancelable: boolean, eventDetail = {}, actions: Actions,
	settings: Settings, styles: Styles, messages: Message[], paths: string[]): boolean => {

	// Create a custom event with the provided name and detail
	const event: RcbEvent = new CustomEvent(eventName, {
		detail: eventDetail,
		cancelable: cancelable,
	});

	event.actions = actions;
	event.settings = settings;
	event.styles = styles;
	event.messages = messages;
	event.paths = paths;

	window.dispatchEvent(event);
	return event.defaultPrevented;
}

export const emitRcbPreMessageInjectEvent = (details: object, actions: Actions,
	settings: Settings, styles: Styles, messages: Message[], paths: string[]) => {
	const eventName = "rcb-pre-message-inject";
	const cancelable = true;
	return emitEventAndGetIsPrevented(eventName, cancelable, details, actions, settings, styles, messages, paths);
}

export const emitRcbPostMessageInjectEvent = (details: object, actions: Actions,
	settings: Settings, styles: Styles, messages: Message[], paths: string[]) => {
	const eventName = "rcb-post-message-inject";
	const cancelable = false;
	return emitEventAndGetIsPrevented(eventName, cancelable, details, actions, settings, styles, messages, paths);
}