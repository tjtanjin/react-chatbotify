import { Block } from "./Block";

/**
 * Defines a conversation Flow (made up of conversation blocks).
 */
export type Flow = Record<string, Block>;