/**
 * Defines a plugin type.
 */
export type Plugin = (...args: unknown[]) => (...hookArgs: unknown[]) => string;