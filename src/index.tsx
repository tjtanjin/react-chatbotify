import ChatBot from "./components/ChatBot";
import { getDefaultSettings } from "./utils/configParser";
import { getDefaultStyles } from "./utils/configParser";
import { SettingsContext } from "./context/SettingsContext";
import { StylesContext } from "./context/StylesContext";
import { MessagesContext } from "./context/MessagesContext";
import { PathsContext } from "./context/PathsContext";
import { Block } from "./types/Block";
import { Params } from "./types/Params";
import { Flow } from "./types/Flow";
import { Message } from "./types/Message";
import { Settings } from "./types/Settings";
import { Styles } from "./types/Styles";
import { Theme } from "./types/Theme";
import { Button } from "./constants/Button";

// util exports
export { getDefaultSettings, getDefaultStyles };

// context exports
export { SettingsContext, StylesContext, MessagesContext, PathsContext };

// type exports
export type { Block, Params, Flow, Message, Settings, Styles, Theme };

// constant exports
export { Button };

// chatbot export
export default ChatBot;