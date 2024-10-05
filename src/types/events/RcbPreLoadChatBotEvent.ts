import { RcbBaseEvent } from "../internal/events/RcbBaseEvent";
import { Flow } from "../Flow";
import { Plugin } from "../Plugin";
import { Settings } from "../Settings";
import { Styles } from "../Styles";
import { Theme } from "../Theme";

/**
 * Defines the data available for pre-load chatbot event.
 */
export type RcbPreLoadChatBotEvent = RcbBaseEvent<{
    flow: Flow;
    settings: Settings;
    styles: Styles;
    themes: Theme | Array<Theme>;
	plugins: Array<Plugin>;
}>;