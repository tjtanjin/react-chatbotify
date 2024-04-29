import ChatBot from "./components/ChatBot";
import { getDefaultBotOptions } from "./services/BotOptionsService";
import { BotOptionsContext } from "./context/BotOptionsContext";
import { MessagesContext } from "./context/MessagesContext";
import { PathsContext } from "./context/PathsContext";
import { Block } from "./types/Block";
import { Flow } from "./types/Flow";
import { Message } from "./types/Message";
import { Options } from "./types/Options";
import { Params } from "./types/Params";
import { BUTTON } from "./services/Utils";

/**
 * Exports for developer use.
 */
export {
	// provides the default options
	getDefaultBotOptions,

	// advance usage
	BotOptionsContext,
	MessagesContext,
	PathsContext,

	// exposes buttons for ordering
	BUTTON,
};

export type {
	Block,
	Flow,
	Message,
	Options,
	Params
};

export default ChatBot;