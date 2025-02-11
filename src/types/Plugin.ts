import { Settings } from "./Settings";
import { Styles } from "./Styles";

/**
 * Defines a plugin type.
 */
export type Plugin = (...args: unknown[]) => {
    name: string;
    settings?: Settings;
    styles?: Styles;
}