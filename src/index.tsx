import ChatBot from "./components/ChatBot";
import { BotSettingsContext } from "./context/BotSettingsContext";
import { MessagesContext } from "./context/MessagesContext";
import { PathsContext } from "./context/PathsContext";
import { Block } from "./types/Block";
import { BlockParams } from "./types/BlockParams";
import { Flow } from "./types/Flow";
import { Message } from "./types/Message";
import { Settings } from "./types/Settings";
import { Theme } from "./types/Theme";
import { Button } from "./constants/Button";
import { DefaultSettings } from "./constants/DefaultSettings";
import { DefaultStyles } from "./constants/DefaultStyles";

// context exports
export { BotSettingsContext, MessagesContext, PathsContext };

// constant exports
export { Button, DefaultSettings, DefaultStyles };

// type exports
export type { Block, BlockParams, Flow, Message, Settings, Theme };

export default ChatBot;