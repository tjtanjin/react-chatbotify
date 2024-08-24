/**
 * Defines the configuration options for a theme.
 */
export type Theme = {
	id: string; // id to identify theme
	version?: string; // theme versiom
	baseUrl?: string; // base url for fetching themes
	cacheDuration?: number; // time in seconds before theme cache expires
}