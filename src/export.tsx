import ChatBot from "./components/ChatBot";
import { getDefaultBotOptions } from "./services/BotOptionsService";
import { useBotOptions, BotOptionsContext } from "./context/BotOptionsContext";
import { useMessages, MessagesContext } from "./context/MessagesContext";
import { usePaths, PathsContext } from "./context/PathsContext";
import { Block } from "./types/Block";
import { Flow } from "./types/Flow";
import { Message } from "./types/Message";
import { Options } from "./types/Options";
import { Params } from "./types/Params";

/**
 * Exports for developer use.
 */
export {
	ChatBot,
	getDefaultBotOptions,
	BotOptionsContext,
	useBotOptions,
	MessagesContext,
	useMessages,
	PathsContext,
	usePaths
};

export type {
	Block,
	Flow,
	Message,
	Options,
	Params
};

export default ChatBot;