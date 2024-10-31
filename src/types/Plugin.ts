import { Settings } from "./Settings";
import { Styles } from "./Styles";
import { Theme } from "./Theme";

/**
 * Defines a plugin type.
 */
export type Plugin = (...args: unknown[]) => {
    name: string;
    settings?: Settings;
    styles?: Styles;
}