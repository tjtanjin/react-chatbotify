import ChatBot from "./components/ChatBot";
import { BotOptionsContext } from "./context/BotOptionsContext";
import { MessagesContext } from "./context/MessagesContext";
import { PathsContext } from "./context/PathsContext";
import { Block } from "./types/Block";
import { Flow } from "./types/Flow";
import { Message } from "./types/Message";
import { Options } from "./types/Options";
import { Params } from "./types/Params";
import { Button } from "./constants/Button";
import { DefaultOptions } from "./constants/DefaultOptions";

// context exports
export { BotOptionsContext, MessagesContext, PathsContext };

// constant exports
export { Button };
export { DefaultOptions };

// type exports
export type { Block, Flow, Message, Options, Params };

export default ChatBot;