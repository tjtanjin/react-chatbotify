import { createElement, isValidElement, Dispatch, SetStateAction, ReactNode, CSSProperties } from "react";
import ReactDOMServer from "react-dom/server";

import ChatHistoryLineBreak from "../components/ChatHistoryLineBreak/ChatHistoryLineBreak";
import LoadingSpinner from "../components/LoadingSpinner/LoadingSpinner";
import { Message } from "../types/Message";
import { BotSettings } from "../types/BotSettings";
import { BotStyles } from "../types/BotStyles";

// variables used to track history, updated when botSettings.chatHistory value changes
let historyLoaded = false;
let historyStorageKey = "rcb-history";
let historyMaxEntries = 30;
let historyDisabled = false;
let historyMessages: Message[] = [];

/**
 * Updates the messages array with a new message appended at the end and saves chat history if enabled.
 * 
 * @param messages messages containing current conversation with the bot
 */
const saveChatHistory = async (messages: Message[]) => {
	if (historyDisabled) {
		return;
	}
	
	const messagesToSave: Message[] = [];
	const offset = historyLoaded ? historyMessages.length : 0;

	for (let i = messages.length - 1; i >= offset; i--) {
		const message = messages[i];

		if (message.sender === "system") {
			break;
		}

		if (message.content !== "") {
			messagesToSave.unshift(message);
		}

		if (messagesToSave.length === historyMaxEntries) {
			break;
		}
	}

	let parsedMessages: Message[] = messagesToSave.map(parseMessageToString);
	if (parsedMessages.length < historyMaxEntries) {
		const difference = historyMaxEntries - parsedMessages.length;
		parsedMessages = [...historyMessages.slice(-difference), ...parsedMessages]
	}

	localStorage.setItem(historyStorageKey, JSON.stringify(parsedMessages));
}

/**
 * Retrieves chat history.
 * 
 * @param historyStorageKey key used to identify chat history stored in local storage
 */
const getHistoryMessages = (chatHistory: string) => {
	if (chatHistory != null) {
		try {
			return JSON.parse(chatHistory);
		} catch {
			return [];
		}
	}
	return [];
}

/**
 * Sets the currently used history storage key.
 * 
 * @param botSettings options provided to the bot
 */
const setHistoryStorageValues = (botSettings: BotSettings) => {
	historyStorageKey = botSettings.chatHistory?.storageKey as string;
	historyMaxEntries = botSettings.chatHistory?.maxEntries as number;
	historyDisabled = botSettings.chatHistory?.disabled as boolean;
	historyMessages = getHistoryMessages(localStorage.getItem(historyStorageKey) as string);
}

/**
 * Parses message into string for chat history storage.
 * 
 * @param message message to parse
 */
const parseMessageToString = (message: Message) => {
	if (isValidElement(message.content)) {
		const clonedMessage = structuredClone({
			content: ReactDOMServer.renderToString(message.content),
			type: "object",
			sender: message.sender,
		});
		return clonedMessage;
	}

	return {...message, type: "string"}
}

/**
 * Loads chat history into the chat window for user view.
 * 
 * @param botSettings options provided to the bot
 * @param chatHistory chat history to show
 * @param setMessages setter for updating messages
 * @param setTextAreaDisabled setter for enabling/disabling user text area
 */
const loadChatHistory = (botSettings: BotSettings, botStyles: BotStyles, chatHistory: string,
	setMessages: Dispatch<SetStateAction<Message[]>>, setTextAreaDisabled: Dispatch<SetStateAction<boolean>>) => {

	historyLoaded = true;
	if (chatHistory != null) {
		try {
			setMessages((prevMessages) => {
				const loaderMessage = {
					content: <LoadingSpinner/>,
					sender: "system"
				}
				prevMessages.shift();
				return [loaderMessage, ...prevMessages];
			});

			const parsedMessages = JSON.parse(chatHistory).map((message: Message) => {
				if (message.type === "object") {
					const element = renderHTML(message.content as string, botSettings, botStyles);
					return { ...message, content: element };
				}
				return message;
			});

			setTimeout(() => {
				setMessages((prevMessages) => {
					prevMessages.shift();
					// if autoload, line break is invisible
					let lineBreakMessage;
					if (botSettings.chatHistory?.autoLoad) {
						lineBreakMessage = {
							content: <></>,
							sender: "system"
						}
					} else {
						lineBreakMessage = {
							content: <ChatHistoryLineBreak/>,
							sender: "system"
						}
					}
					return [...parsedMessages, lineBreakMessage, ...prevMessages];
				});
				setTextAreaDisabled(botSettings.chatInput?.disabled || false);
			}, 500)
		} catch {
			// remove chat history on error (to address corrupted storage values)
			localStorage.removeItem(botSettings.chatHistory?.storageKey as string);
		}
	}
}

/**
 * Renders html string to a react node.
 * 
 * @param html string to render
 * @param botSettings options provided to the bot
 */
const renderHTML = (html: string, botSettings: BotSettings, botStyles: BotStyles): ReactNode[] => {
	const parser = new DOMParser();
	const parsedHtml = parser.parseFromString(html, "text/html");
	const nodes = Array.from(parsedHtml.body.childNodes);
  
	const renderNodes: ReactNode[] = nodes.map((node, index) => {
		if (node.nodeType === Node.TEXT_NODE) {
			return node.textContent;
		} else {
			const tagName = (node as Element).tagName.toLowerCase();
			let attributes = Array.from((node as Element).attributes).reduce((acc, attr) => {
				const attributeName = attr.name.toLowerCase();
				if (attributeName === "style") {
					const styleProperties = attr.value.split(";").filter(property => property.trim() !== "");
					const styleObject: { [key: string]: string } = {};
					styleProperties.forEach(property => {
						const [key, value] = property.split(":").map(part => part.trim());
						const reactCompliantKey = key.replace(/-([a-z])/g, (match, letter) => letter.toUpperCase());
						styleObject[reactCompliantKey] = value;
					});
					acc[attributeName] = styleObject;
				} else if ((tagName === "audio" || tagName === "video")
					&& attributeName === "controls" && attr.value === "") {
					acc[attributeName] = "true";
				} else {
					acc[attributeName] = attr.value;
				}
				return acc;
			}, {} as { [key: string]: string | CSSProperties });

			const classList = (node as Element).classList;
			if (botSettings.botBubble?.showAvatar) {
				attributes = addStyleToContainers(classList, attributes);
			}
			attributes = addStyleToOptions(classList, attributes, botSettings, botStyles);
			attributes = addStyleToCheckboxRows(classList, attributes, botSettings, botStyles);
			attributes = addStyleToCheckboxNextButton(classList, attributes, botSettings, botStyles);
			attributes = addStyleToMediaDisplayContainer(classList, attributes, botSettings, botStyles);

			const voidElements = ['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link',
				'meta', 'source', 'track', 'wbr'];
			if (voidElements.includes(tagName)) {
				// void elements must not have children
				return createElement(tagName, { key: index, ...attributes });
			} else {
				const children = renderHTML((node as Element).innerHTML, botSettings, botStyles);
				return createElement(tagName, { key: index, ...attributes }, ...children);
			}
		}
	});
  
	return renderNodes;
};


/**
 * Add styles (that were lost when saving to history) to options container/checkbox container.
 * 
 * @param classList array of classes the element has
 * @param attributes current attributes the element has
 */
const addStyleToContainers = (classList: DOMTokenList, attributes: {[key: string]: string | CSSProperties}) => {
	if (classList.contains("rcb-options-container") || classList.contains("rcb-checkbox-container")) {
		if (Object.prototype.hasOwnProperty.call(attributes, "class")) {
			attributes["class"] = `${classList.toString()} rcb-options-offset`;
		} else {
			attributes["class"] = "rcb-options-offset"
		}
	}
	return attributes;
}

/**
 * Add styles (that were lost when saving to history) to options.
 * 
 * @param classList array of classes the element has
 * @param attributes current attributes the element has
 * @param botSettings options provided to the bot
 */
const addStyleToOptions = (classList: DOMTokenList, attributes: {[key: string]: string | CSSProperties},
	botSettings: BotSettings, botStyles: BotStyles) => {
	if (classList.contains("rcb-options")) {
		attributes["style"] = {
			...(attributes["style"] as CSSProperties),
			color: botStyles.botOptionStyle?.color || botSettings.general?.primaryColor,
			borderColor: botStyles.botOptionStyle?.color || botSettings.general?.primaryColor,
			cursor: `url(${botSettings.general?.actionDisabledIcon}), auto`,
			...botStyles.botOptionStyle
		}
	}
	return attributes;
}

/**
 * Add styles (that were lost when saving to history) to checkbox rows.
 * 
 * @param classList array of classes the element has
 * @param attributes current attributes the element has
 * @param botSettings options provided to the bot
 */
const addStyleToCheckboxRows = (classList: DOMTokenList, attributes: {[key: string]: string | CSSProperties},
	botSettings: BotSettings, botStyles: BotStyles) => {
	if (classList.contains("rcb-checkbox-row-container")) {
		attributes["style"] = {
			...(attributes["style"] as CSSProperties),
			color: botStyles.botCheckboxRowStyle?.color || botSettings.general?.primaryColor,
			borderColor: botStyles.botCheckboxRowStyle?.color || botSettings.general?.primaryColor,
			cursor: `url(${botSettings.general?.actionDisabledIcon}), auto`,
			...botStyles.botCheckboxRowStyle
		}
	}
	return attributes;
}

/**
 * Add styles (that were lost when saving to history) to checkbox next button.
 * 
 * @param classList array of classes the element has
 * @param attributes current attributes the element has
 * @param botSettings options provided to the bot
 */
const addStyleToCheckboxNextButton = (classList: DOMTokenList, attributes: {[key: string]: string | CSSProperties},
	botSettings: BotSettings, botStyles: BotStyles) => {
	if (classList.contains("rcb-checkbox-next-button")) {
		attributes["style"] = {
			...(attributes["style"] as CSSProperties),
			color: botStyles.botCheckboxNextStyle?.color || botSettings.general?.primaryColor,
			borderColor: botStyles.botCheckboxNextStyle?.color || botSettings.general?.primaryColor,
			cursor: `url(${botSettings.general?.actionDisabledIcon}), auto`,
			...botStyles.botCheckboxNextStyle
		}
	}
	return attributes;
}

/**
 * Add styles (that were lost when saving to history) to options.
 *
 * @param classList array of classes the element has
 * @param attributes current attributes the element has
 * @param botSettings options provided to the bot
 */
const addStyleToMediaDisplayContainer = (classList: DOMTokenList, attributes: {[key: string]: string | CSSProperties},
	botSettings: BotSettings, botStyles: BotStyles) => {
	if (classList.contains("rcb-media-display-image-container")
		|| classList.contains("rcb-media-display-video-container")) {
		attributes["style"] = {
			...(attributes["style"] as CSSProperties),
			backgroundColor: botSettings.general?.primaryColor,
			maxWidth: botSettings.userBubble?.showAvatar ? "65%" : "70%",
			...botStyles.mediaDisplayContainerStyle
		}
	}
	return attributes;
}

export {
	saveChatHistory,
	loadChatHistory,
	setHistoryStorageValues
}