import ChatBot from "./components/ChatBot";
import { SettingsContext } from "./context/SettingsContext";
import { MessagesContext } from "./context/MessagesContext";
import { PathsContext } from "./context/PathsContext";
import { Block } from "./types/Block";
import { Flow } from "./types/Flow";
import { Message } from "./types/Message";
import { Settings } from "./types/Settings";
import { Params } from "./types/Params";
import { Button } from "./constants/Button";
import { DefaultSettings } from "./constants/DefaultSettings";

// context exports
export { SettingsContext, MessagesContext, PathsContext };

// constant exports
export { Button };
export { DefaultSettings };

// type exports
export type { Block, Flow, Message, Settings as Options, Params };

export default ChatBot;