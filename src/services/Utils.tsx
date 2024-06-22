import { Flow } from "../types/Flow";
import { Params } from "../types/Params";

// todo: consider re-organizing the functions in this file, getting a little varied and long

// default welcome options
const helpOptions = ["Quickstart", "API Docs", "Examples", "Github", "Discord"];

// default provided welcome flow if user does not pass in a flow to the chat bot
export const defaultFlow: Flow = {
	start: {
		message: "Hello, I am Tan Jin 👋! Welcome to React ChatBotify, I'm excited that you are using our " +
			"chatbot 😊!",
		transition: {duration: 1000},
		chatDisabled: true,
		path: "show_options"
	},
	show_options: {
		message: "It looks like you have not set up a conversation flow yet. No worries! Here are a few helpful " +
			"things you can check out to get started:",
		options: helpOptions,
		path: "process_options"
	},
	prompt_again: {
		message: "Do you need any other help?",
		options: helpOptions,
		path: "process_options"
	},
	unknown_input: {
		message: "Sorry, I do not understand your message 😢! If you require further assistance, you may click on " +
			"the Github option and open an issue there or visit our discord.",
		options: helpOptions,
		path: "process_options"
	},
	process_options: {
		transition: {duration: 0},
		path: (params: Params) => {
			let link = "";
			switch (params.userInput) {
			case "Quickstart":
				link = "https://react-chatbotify.tjtanjin.com/docs/introduction/quickstart/";
				break;
			case "API Docs":
				link = "https://react-chatbotify.tjtanjin.com/docs/api/bot_options";
				break;
			case "Examples":
				link = "https://react-chatbotify.tjtanjin.com/docs/examples/basic_form";
				break;
			case "Github":
				link = "https://github.com/tjtanjin/react-chatbotify/";
				break;
			case "Discord":
				link = "https://discord.gg/6R4DK4G5Zh";
				break;
			default:
				return "unknown_input";
			}
			params.injectMessage("Sit tight! I'll send you right there!");
			setTimeout(() => {
				window.open(link);
			}, 1000)
			return "repeat"
		},
	},
	repeat: {
		transition: {duration: 3000},
		path: "prompt_again"
	},
}

// boolean indicating if user is on desktop (otherwise treated as on mobile)
export const isDesktop = !(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));

/**
 * Parses message that has markup enabled (holds html tags as individual elements to enable smooth streaming).
 * 
 * @param message message to parse
 */
export const parseMarkupMessage = (message: string) => {
	const result: string[] = [];
	let currentTag = "";
	let isInTag = false;

	for (let i = 0; i < message.length; i++) {
		const char = message[i];

		if (char === "<") {
			// detects start of html tag
			if (!isInTag) {
				isInTag = true;
				currentTag = char;
			} else {
				result.push(currentTag);
				currentTag = char;
			}
		} else if (char === ">") {
			// detects end of html tag
			currentTag += char;
			result.push(currentTag);
			currentTag = "";
			isInTag = false;
		} else {
			// handles normal character 
			if (isInTag) {
				currentTag += char;
			} else {
				result.push(char);
			}
		}
	}
  
	if (currentTag !== "") {
		result.push(currentTag);
	}
	return result;
}

/**
 * Checks if chatbot is visible (uses chatbot body as reference).
 * 
 * @param element chatbot body used to gauge visibility
 */
export const isChatBotVisible = (element: HTMLDivElement) => {
	if (!element) {
		return false;
	}

	const rect = element.getBoundingClientRect();
	const windowHeight = (window.innerHeight || document.documentElement.clientHeight);
	const windowWidth = (window.innerWidth || document.documentElement.clientWidth);

	return (
		rect.top >= 0 &&
		rect.left >= 0 &&
		rect.bottom <= windowHeight &&
		rect.right <= windowWidth
	);
}

/**
 * Retrieves details of a file (only for image, video and audio) which consists of its type and URL.
 *
 * @param file file object to get details from
 */
export const getMediaFileDetails = async (file: File): Promise<{ fileType: string | null, fileUrl: string | null }> => {
	if (!file) {
		return { fileType: null, fileUrl: null };
	}

	const fileType = file.type.split('/')[0];

	if (!["image", "video", "audio"].includes(fileType)) {
		return { fileType: null, fileUrl: null };
	}

	try {
		const fileUrl = await new Promise<string>((resolve, reject) => {
			const reader = new FileReader();
			reader.onload = () => resolve(reader.result as string);
			reader.onerror = () => reject(new Error("File reading failed"));
			reader.readAsDataURL(file);
		});

		return { fileType, fileUrl };
	} catch (error) {
		return { fileType: null, fileUrl: null };
	}
};