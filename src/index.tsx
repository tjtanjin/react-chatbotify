import ChatBot from "./components/ChatBot";
import { BotSettingsContext } from "./context/BotSettingsContext";
import { BotStylesContext } from "./context/BotStylesContext";
import { MessagesContext } from "./context/MessagesContext";
import { PathsContext } from "./context/PathsContext";
import { Block } from "./types/Block";
import { BlockParams } from "./types/BlockParams";
import { Flow } from "./types/Flow";
import { Message } from "./types/Message";
import { BotSettings } from "./types/BotSettings";
import { BotStyles } from "./types/BotStyles";
import { Theme } from "./types/Theme";
import { Button } from "./constants/Button";
import { DefaultSettings } from "./constants/DefaultSettings";
import { DefaultStyles } from "./constants/DefaultStyles";

// context exports
export { BotSettingsContext, BotStylesContext, MessagesContext, PathsContext };

// type exports
export type { Block, BlockParams, Flow, Message, BotSettings, BotStyles, Theme };

// constant exports
export { Button, DefaultSettings, DefaultStyles };

export default ChatBot;