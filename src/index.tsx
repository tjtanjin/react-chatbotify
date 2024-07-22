import ChatBot from "./components/ChatBot";
import { getDefaultSettings } from "./utils/configParser";
import { getDefaultBotStyles } from "./utils/configParser";
import { SettingsContext } from "./context/SettingsContext";
import { BotStylesContext } from "./context/BotStylesContext";
import { MessagesContext } from "./context/MessagesContext";
import { PathsContext } from "./context/PathsContext";
import { Block } from "./types/Block";
import { AttributeParams } from "./types/AttributeParams";
import { Flow } from "./types/Flow";
import { Message } from "./types/Message";
import { Settings } from "./types/Settings";
import { BotStyles } from "./types/BotStyles";
import { Theme } from "./types/Theme";
import { Button } from "./constants/Button";

// util exports
export { getDefaultSettings, getDefaultBotStyles };

// context exports
export { SettingsContext, BotStylesContext, MessagesContext, PathsContext };

// type exports
export type { Block, AttributeParams, Flow, Message, Settings, BotStyles, Theme };

// constant exports
export { Button };

// chatbot export
export default ChatBot;