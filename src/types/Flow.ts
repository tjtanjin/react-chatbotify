import { Block } from "./Block";

/**
 * Defines a conversation Flow (made up of conversation blocks).
 */
export type Flow = {
	start: Block;
	ask_age_group?: Block;
	ask_math_question?: Block;
	ask_favourite_color?: Block;
	ask_favourite_pet?: Block;
	ask_height?: Block;
	ask_weather?: Block;
	close_chat?: Block;
	ask_image?: Block;
	end?: Block;
	loop?: Block;
	incorrect_answer?: Block;
	show_options?: Block;
	prompt_again?: Block;
	unknown_input?: Block;
	process_options?: Block;
	repeat?: Block;
}