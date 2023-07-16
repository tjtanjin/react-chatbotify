import ChatBot from "./components/ChatBot";
import { useBotOptions, BotOptionsContext } from "./context/BotOptionsContext";
import { useMessages, MessagesContext } from "./context/MessagesContext";
import { usePaths, PathsContext } from "./context/PathsContext";

/**
 * Exports for developer use.
 */
export {
	ChatBot,
	BotOptionsContext,
	useBotOptions,
	MessagesContext,
	useMessages,
	PathsContext,
	usePaths
}

export default ChatBot;