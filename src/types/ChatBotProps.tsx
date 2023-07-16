import { Flow } from "./Flow";
import { Options } from "./Options";

/**
 * Defines the props that can be passed into the chat Bot.
 */
export type ChatBotProps = {
	flow?: Flow;
	options?: Options;
}